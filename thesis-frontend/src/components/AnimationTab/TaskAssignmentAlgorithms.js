// TaskAssignmentAlgorithms.js

// Enhanced Particle Swarm Optimization (EPSO)
export function assignTasksWithEPSO(tasks, numVMs, vmCapacity = 2000) {
    const numParticles = 20;
    const maxIterations = 30;
    const wMax = 0.9;
    const wMin = 0.4;
    const c1 = 2;
    const c2 = 2;
    const vMax = 1;
    const mutationRate = 0.01;
  
    const dimension = tasks.length;
    const swarm = [];
  
    // Seeded random generator for consistent results
    let seed = 42;
    const rand = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
  
    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      let position = Array.from({ length: dimension }, (_, idx) => idx % numVMs);
      position = shuffle(position);
      const velocity = Array.from({ length: dimension }, () => rand() * 2 - 1);
      const fitness = evaluateFitness(position, tasks, numVMs, vmCapacity);
      swarm.push({ position, velocity, pbest: [...position], pbestFitness: fitness });
    }
  
    let gbest = [...swarm[0].pbest];
    let gbestFitness = swarm[0].pbestFitness;
  
    // Main optimization loop
    for (let iteration = 1; iteration <= maxIterations; iteration++) {
      const w = wMax - (wMax - wMin) * (iteration / maxIterations);
  
      for (const particle of swarm) {
        const currentFitness = evaluateFitness(particle.position, tasks, numVMs, vmCapacity);
  
        if (currentFitness < particle.pbestFitness) {
          particle.pbest = [...particle.position];
          particle.pbestFitness = currentFitness;
        }
  
        if (currentFitness < gbestFitness) {
          gbest = [...particle.position];
          gbestFitness = currentFitness;
        }
      }
  
      for (const particle of swarm) {
        for (let d = 0; d < dimension; d++) {
          const r1 = rand();
          const r2 = rand();
          let newV = w * particle.velocity[d] +
            c1 * r1 * (particle.pbest[d] - particle.position[d]) +
            c2 * r2 * (gbest[d] - particle.position[d]);
  
          newV = Math.max(Math.min(newV, vMax), -vMax);
          particle.velocity[d] = newV;
  
          let newPos = Math.round(particle.position[d] + newV);
          newPos = Math.max(0, Math.min(numVMs - 1, newPos));
  
          if (rand() < mutationRate) {
            newPos = Math.floor(rand() * numVMs);
          }
  
          particle.position[d] = newPos;
        }
      }
    }
  
    // Build the final task assignments from the best particle
    const assignments = {};
    for (let i = 0; i < numVMs; i++) {
      assignments[i] = [];
    }
  
    for (let i = 0; i < gbest.length; i++) {
      assignments[gbest[i]].push(tasks[i]);
    }
  
    return assignments;
  }
  
  // Enhanced Ant Colony Optimization (EACO)
  export function assignTasksWithEACO(tasks, numVMs, vmCapacity = 2000) {
    // ACO parameters
    const MAX_ITERATIONS = 50;
    const NUM_ANTS = 15;
    const EVAPORATION_RATE = 0.4;
    const ALPHA = 1.0; // Pheromone importance
    const BETA = 2.0;  // Heuristic importance
    const Q = 100;     // Pheromone constant
    const INITIAL_PHEROMONE = 1.0;
    
    // Initialize pheromone matrix
    let pheromones = Array(numVMs).fill(INITIAL_PHEROMONE);
    
    let bestAssignment = {};
    let bestFitness = Infinity;
    let bestLoads = Array(numVMs).fill(0);
  
    // Seeded random generator for consistent results
    let seed = 42;
    const rand = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  
    // Main optimization loop
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      const antAssignments = [];
      const antFitnesses = [];
      const antLoads = [];
  
      // Each ant constructs a solution
      for (let ant = 0; ant < NUM_ANTS; ant++) {
        const vmLoads = Array(numVMs).fill(0);
        const assignment = {};
        for (let i = 0; i < numVMs; i++) {
          assignment[i] = [];
        }
  
        // Shuffle tasks for random order (different for each ant)
        const shuffledTasks = [...tasks].sort(() => rand() - 0.5);
  
        for (const task of shuffledTasks) {
          const taskLoad = parseFloat(task.cpu_request) || 0;
          let availableVMs = [];
  
          // Find VMs that can accommodate this task
          for (let vm = 0; vm < numVMs; vm++) {
            if (vmLoads[vm] + taskLoad <= vmCapacity) {
              availableVMs.push(vm);
            }
          }
  
          // If no VM can take this task, find the least loaded one
          if (availableVMs.length === 0) {
            let minLoad = Infinity;
            let selectedVM = 0;
            for (let vm = 0; vm < numVMs; vm++) {
              if (vmLoads[vm] < minLoad) {
                minLoad = vmLoads[vm];
                selectedVM = vm;
              }
            }
            availableVMs = [selectedVM];
          }
  
          // Calculate probabilities for each available VM
          const probabilities = availableVMs.map(vm => {
            const heuristic = 1 / (vmLoads[vm] + 0.1); // Avoid division by zero
            return {
              vm,
              value: Math.pow(pheromones[vm], ALPHA) * Math.pow(heuristic, BETA)
            };
          });
  
          const total = probabilities.reduce((sum, p) => sum + p.value, 0);
          const normalizedProbs = probabilities.map(p => p.value / total);
  
          // Roulette wheel selection
          let selectedVM = availableVMs[0];
          let randVal = rand();
          let cumulativeProb = 0;
  
          for (let i = 0; i < normalizedProbs.length; i++) {
            cumulativeProb += normalizedProbs[i];
            if (randVal <= cumulativeProb) {
              selectedVM = availableVMs[i];
              break;
            }
          }
  
          // Assign task to selected VM
          vmLoads[selectedVM] += taskLoad;
          assignment[selectedVM].push(task);
        }
  
        // Calculate fitness for this ant's solution
        const fitness = evaluateFitnessFromLoads(vmLoads, vmCapacity);
  
        // Store ant's results
        antAssignments.push(assignment);
        antFitnesses.push(fitness);
        antLoads.push(vmLoads);
  
        // Update best solution found so far
        if (fitness < bestFitness) {
          bestFitness = fitness;
          bestAssignment = JSON.parse(JSON.stringify(assignment));
          bestLoads = [...vmLoads];
        }
      }
  
      // Update pheromones
      // Evaporation
      for (let vm = 0; vm < numVMs; vm++) {
        pheromones[vm] *= (1 - EVAPORATION_RATE);
      }
  
      // Add pheromones based on ant solutions
      for (let ant = 0; ant < NUM_ANTS; ant++) {
        const deltaPheromone = Q / (antFitnesses[ant] + 1); // +1 to avoid division by zero
        const vmLoads = antLoads[ant];
  
        for (let vm = 0; vm < numVMs; vm++) {
          if (vmLoads[vm] > 0) {
            pheromones[vm] += deltaPheromone * (1 - (vmLoads[vm] / vmCapacity));
          }
        }
      }
    }
  
    return bestAssignment;
  }
  
  // Helper function to evaluate fitness from VM loads
  function evaluateFitnessFromLoads(loads, vmCapacity) {
    const avg = loads.reduce((sum, l) => sum + l, 0) / loads.length;
    const variance = loads.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / loads.length;
    const stdDev = Math.sqrt(variance);
  
    const overloadPenalty = loads.reduce((penalty, load) => {
      return penalty + (load > vmCapacity ? Math.pow(load - vmCapacity, 2) : 0);
    }, 0);
  
    return stdDev + overloadPenalty;
  }
  
  // Original fitness evaluation function (for EPSO)
  function evaluateFitness(position, tasks, numVMs, vmCapacity) {
    const loads = Array(numVMs).fill(0);
  
    for (let i = 0; i < position.length; i++) {
      const vmId = position[i];
      const load = parseFloat(tasks[i].cpu_request) || 0;
      loads[vmId] += load;
    }
  
    return evaluateFitnessFromLoads(loads, vmCapacity);
  }