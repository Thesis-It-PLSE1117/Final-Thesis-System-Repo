export function assignTasksWithRoundRobin(tasks, numVMs) {
    const assignments = {};
    const vmCapacities = Array(numVMs).fill(0);
  
    for (let i = 0; i < numVMs; i++) {
      assignments[i] = [];
    }
  
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const vmId = i % numVMs;
      assignments[vmId].push(task);
      vmCapacities[vmId] += parseFloat(task.cpu_request) || 0;
    }
  
    return assignments;
  }
  
  export function assignTasksWithEPSO(tasks, numVMs, vmCapacity = 2000) {
    const numParticles = 20;
    const maxIterations = 30;
    const wMax = 0.9;
    const wMin = 0.4;
    const c1 = 2;
    const c2 = 2;
    const vMax = 1; // Reduced to prevent erratic jumps
    const mutationRate = 0.01; // Lowered for stability
  
    const dimension = tasks.length;
    const swarm = [];
  
    // Seeded random generator for consistent results (deterministic behavior)
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
      const w = wMax - (wMax - wMin) * (iteration / maxIterations); // Linear inertia reduction
  
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
  
  
  
  function evaluateFitness(position, tasks, numVMs, vmCapacity = 2000) {
    const loads = Array(numVMs).fill(0);
  
    for (let i = 0; i < position.length; i++) {
      const vmId = position[i];
      const load = parseFloat(tasks[i].cpu_request) || 0;
      loads[vmId] += load;
    }
  
    const avg = loads.reduce((sum, l) => sum + l, 0) / numVMs;
    const variance = loads.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / numVMs;
    const stdDev = Math.sqrt(variance);
  
    const overloadPenalty = loads.reduce((penalty, load) => {
      return penalty + (load > vmCapacity ? Math.pow(load - vmCapacity, 2) : 0);
    }, 0);
  
    return stdDev + overloadPenalty;
  }
  
  
  