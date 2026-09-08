import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { PERFUME_BOTTLE_ASSETS, PerfumeBottleAsset } from '../types/threeScene';

// Shared GLTFLoader and DRACOLoader singletons
let sharedGLTFLoader: GLTFLoader | null = null;
let sharedDRACOLoader: DRACOLoader | null = null;

function getGLTFLoader(): GLTFLoader {
  if (!sharedGLTFLoader) {
    sharedGLTFLoader = new GLTFLoader();

    // Configure DRACO decoder with official Google Draco CDN
    sharedDRACOLoader = new DRACOLoader();
    sharedDRACOLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    sharedDRACOLoader.setDecoderConfig({ type: 'js' });
    sharedGLTFLoader.setDRACOLoader(sharedDRACOLoader);
  }
  return sharedGLTFLoader;
}

export interface NormalizedModelResult {
  asset: PerfumeBottleAsset;
  group: THREE.Group;
  size: THREE.Vector3;
  center: THREE.Vector3;
  scaleFactor: number;
  bottomOffset: number;
}

// In-memory cache for normalized model hierarchies
const modelCache: Map<string, NormalizedModelResult> = new Map();

/**
 * Normalizes a loaded GLTF scene:
 * 1. Computes bounding box and true geometric center.
 * 2. Centers the model so (0, 0, 0) is the exact center of pivot.
 * 3. Normalizes scale so all bottles match a consistent, luxury proportional height.
 * 4. Tunes PBR materials (roughness, metalness, envMapIntensity, shadows).
 */
export function normalizeBottleScene(
  rawScene: THREE.Group,
  asset: PerfumeBottleAsset
): NormalizedModelResult {
  // Clone raw scene to avoid mutating originals if reused
  const sceneClone = rawScene.clone(true);

  // Traverse all meshes to optimize shadows and luxury PBR materials
  sceneClone.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          mat.needsUpdate = true;

          // Standard and physical PBR enhancements for glass and gold
          if ('envMapIntensity' in mat) {
            (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.8;
          }

          // Special treatment for transmission / flint glass
          if ('transmission' in mat && (mat as THREE.MeshPhysicalMaterial).transmission > 0.02) {
            const physMat = mat as THREE.MeshPhysicalMaterial;
            physMat.transmission = Math.max(physMat.transmission, 0.85);
            physMat.roughness = Math.min(physMat.roughness, 0.06);
            physMat.ior = 1.52; // Natural luxury flint glass IOR
            physMat.clearcoat = 1.0;
            physMat.clearcoatRoughness = 0.04;
            physMat.envMapIntensity = 2.2;
            physMat.reflectivity = 0.95;
            physMat.transparent = true;
            physMat.depthWrite = true;
          }

          // Enhance metallic accents (gold collars, sprayers, crest inscriptions)
          if ('metalness' in mat && (mat as THREE.MeshStandardMaterial).metalness > 0.35) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.metalness = Math.max(stdMat.metalness, 0.88);
            stdMat.roughness = Math.min(stdMat.roughness, 0.14); // Ultra-smooth liquid gold mirror sheen
            stdMat.envMapIntensity = 2.5; // Natural glisten against dark backdrop
          }
        });
      }
    }
  });

  // Calculate bounding box and centroid
  const box = new THREE.Box3().setFromObject(sceneClone);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // Uniform scale normalization: standard target dimension
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  const targetScale = asset.targetScale || 2.7;
  const scaleFactor = targetScale / maxDimension;

  // Create wrapper group with pivot strictly centered at (0, 0, 0)
  const pivotGroup = new THREE.Group();
  pivotGroup.name = `Pivot_${asset.id}`;

  // Center inner scene inside pivot
  sceneClone.position.set(-center.x, -center.y, -center.z);
  pivotGroup.add(sceneClone);
  pivotGroup.scale.setScalar(scaleFactor);

  // Bottom offset relative to center (useful for ground contact)
  const bottomOffset = -(size.y * scaleFactor) / 2;

  const result: NormalizedModelResult = {
    asset,
    group: pivotGroup,
    size,
    center,
    scaleFactor,
    bottomOffset
  };

  return result;
}

/**
 * Loads and normalizes a single perfume bottle GLB model asynchronously.
 */
export async function loadBottleModel(
  asset: PerfumeBottleAsset,
  onProgress?: (progress: number) => void
): Promise<NormalizedModelResult> {
  const cached = modelCache.get(asset.id);
  if (cached) {
    if (onProgress) onProgress(1);
    return {
      ...cached,
      group: cached.group.clone(true)
    };
  }

  const loader = getGLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      asset.path,
      (gltf) => {
        try {
          const normalized = normalizeBottleScene(gltf.scene, asset);
          modelCache.set(asset.id, normalized);
          if (onProgress) onProgress(1);
          resolve({
            ...normalized,
            group: normalized.group.clone(true)
          });
        } catch (err) {
          reject(err);
        }
      },
      (xhr) => {
        if (onProgress && xhr.total > 0) {
          onProgress(xhr.loaded / xhr.total);
        }
      },
      (error) => {
        console.error(`Failed loading 3D bottle asset: ${asset.path}`, error);
        reject(error);
      }
    );
  });
}

/**
 * Preloads all 3 perfume bottle models in parallel with aggregate progress reporting.
 */
export async function preloadAllPerfumeModels(
  onAggregateProgress?: (percent: number) => void
): Promise<NormalizedModelResult[]> {
  const totalModels = PERFUME_BOTTLE_ASSETS.length;
  const progressMap = new Map<string, number>();

  const updateProgress = (id: string, fraction: number) => {
    progressMap.set(id, fraction);
    let totalFraction = 0;
    for (const val of progressMap.values()) {
      totalFraction += val;
    }
    const percent = Math.min(100, Math.round((totalFraction / totalModels) * 100));
    if (onAggregateProgress) {
      onAggregateProgress(percent);
    }
  };

  const promises = PERFUME_BOTTLE_ASSETS.map((asset) => {
    progressMap.set(asset.id, 0);
    return loadBottleModel(asset, (fraction) => {
      updateProgress(asset.id, fraction);
    });
  });

  const results = await Promise.all(promises);
  if (onAggregateProgress) {
    onAggregateProgress(100);
  }
  return results;
}

/**
 * Retrieves a cached normalized model group if available.
 */
export function getCachedBottleGroup(id: string): THREE.Group | null {
  const cached = modelCache.get(id);
  return cached ? cached.group.clone(true) : null;
}
