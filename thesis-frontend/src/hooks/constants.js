// Default configuration - used as fallback when presets are cleared
export const DEFAULT_CONFIG = {
  numHosts: 20,               
  numPesPerHost: 8,           
  peMips: 2500,               // 2.5 GHz processors (modern standard)
  ramPerHost: 4096,           // 4GB RAM per host (cost-effective)
  bwPerHost: 10000,           // 10 Gbps network (datacenter standard)
  storagePerHost: 200000,     // 200GB storage per host
  numVMs: 50,                 // 5 VMs per host average (good consolidation ratio)
  vmMips: 1000,               // 1 GHz VM processors (standard cloud VM)
  vmPes: 2,                   // Dual-core VMs (balanced)
  vmRam: 1024,                // 1GB RAM per VM (typical small instance)
  vmBw: 1000,                 // 1 Gbps VM network bandwidth
  vmSize: 10000,              // 10GB storage per VM
  vmScheduler: "TimeShared",   // Fair resource sharing policy
  optimizationAlgorithm: "EACO" // EACO often performs better for cloud scheduling
};

// Preset configurations for different task sizes (including default)
export const PRESET_CONFIGS = {
  'default': {
    ...DEFAULT_CONFIG
  },
  '1k-tasks': {
    numHosts: 10,
    numPesPerHost: 4,
    peMips: 2000,
    ramPerHost: 2048,
    bwPerHost: 5000,
    storagePerHost: 100000,
    numVMs: 20,
    vmMips: 800,
    vmPes: 1,
    vmRam: 512,
    vmBw: 500,
    vmSize: 5000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EACO"
  },
  '5k-tasks': {
    numHosts: 20,
    numPesPerHost: 6,
    peMips: 2500,
    ramPerHost: 4096,
    bwPerHost: 10000,
    storagePerHost: 200000,
    numVMs: 50,
    vmMips: 1000,
    vmPes: 2,
    vmRam: 1024,
    vmBw: 1000,
    vmSize: 10000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EACO"
  },
  '10k-tasks': {
    numHosts: 40,
    numPesPerHost: 8,
    peMips: 3000,
    ramPerHost: 8192,
    bwPerHost: 20000,
    storagePerHost: 500000,
    numVMs: 100,
    vmMips: 1500,
    vmPes: 2,
    vmRam: 2048,
    vmBw: 2000,
    vmSize: 20000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EACO"
  },
  '20k-tasks': {
    numHosts: 80,
    numPesPerHost: 12,
    peMips: 3500,
    ramPerHost: 16384,
    bwPerHost: 40000,
    storagePerHost: 1000000,
    numVMs: 200,
    vmMips: 2000,
    vmPes: 4,
    vmRam: 4096,
    vmBw: 4000,
    vmSize: 40000,
    vmScheduler: "TimeShared",
    optimizationAlgorithm: "EACO"
  }
};

export const DEFAULT_CLOUDLET_COUNT = 100;