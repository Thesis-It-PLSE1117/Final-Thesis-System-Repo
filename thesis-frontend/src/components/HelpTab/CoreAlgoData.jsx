export const coreAlgoData = {
  title: "Core Algorithms",
  description: (
    <>
      About the <span className="font-semibold">meta-heuristic algorithms</span> that we use to answer our study.
    </>
  ),
  icon: "Code",

  quickStart: {
    title: "Baseline Algorithms",
    description: "Quick review of the two foundational algorithms we enhanced:",
    example: {
      ACO: "Ant Colony Optimization",
      PSO: "Particle Swarm Optimization",
      approach: "Nature-inspired metaheuristics",
      goal: "Optimal task scheduling and load balancing",
    },
    note: "Both baseline algorithms showed limitations in dynamic cloud environments, which motivated our enhancements for adaptive behavior and faster convergence.",
  },

  sections: {
    eacoDetails: {
      title: "Enhanced Ant Colony Optimization (EACO)",
      description: (
        <>
          We improved <span className="font-semibold">ant colony algorithm</span> with adaptive pheromone evaporation and heuristic load-based reinforcement.
        </>
      ),
      icon: "Bug",
      items: [
        {
          icon: "Target",
          label: "How It Works",
          explanation: "Virtual ants explore possible task assignments, depositing pheromone trails on promising solutions to guide future exploration.",
          example: "Similar to real ants finding the shortest path to food through chemical trail-following.",
          tip: (
            <>
              <span className="font-semibold">Adapts dynamically</span> using load-based pheromone reinforcement.
            </>
          ),
        },
        {
          icon: "TrendingUp",
          label: "Adaptive Learning",
          explanation: "The algorithm learns by adjusting pheromone evaporation rates (0.1-0.9) based on solution diversity and reinforcing assignments to less-loaded VMs.",
          example: "Stronger pheromone trails emerge on efficient task-VM mappings while poor solutions fade faster.",
          tip: (
            <>
              <span className="font-semibold">Self-regulating</span> convergence speed based on search progress.
            </>
          ),
        },
        {
          icon: "Zap",
          label: "Optimization Goals",
          explanation: "Minimizes response time and makespan while maximizing resource utilization and energy efficiency across the cloud infrastructure.",
          example: "Balances workload distribution to prevent VM overload and underutilization.",
          tip: (
            <>
              Achieves <span className="font-semibold">multi-objective optimization</span> with load balancing.
            </>
          ),
        },
      ],
    },

    epsoDetails: {
      title: "Enhanced Particle Swarm Optimization (EPSO)",
      description: (
        <>
          We improved this <span className="font-semibold">particle swarm algorithm</span> with non-linear inertia decay and adaptive velocity clamping.
        </>
      ),
      icon: "Atom",
      items: [
        {
          icon: "Move",
          label: "Intelligent Movement",
          explanation: "Each particle represents a complete task assignment solution that moves through the search space guided by cognitive (personal best) and social (global best) learning.",
          example: "Particles explore different VM allocation strategies, learning from individual and collective experience.",
          tip: (
            <>
              Velocity decreases from <span className="font-semibold">6.0 to 1.0</span> over iterations for refined search.
            </>
          ),
        },
        {
          icon: "Users",
          label: "Swarm Collaboration",
          explanation: "Particles share information about successful task distributions, enabling the swarm to converge cooperatively toward optimal solutions.",
          example: "The population of 50 particles explores diverse regions while gravitating toward high-quality assignments.",
          tip: (
            <>
              <span className="font-semibold">Population-based</span> parallel exploration with information sharing.
            </>
          ),
        },
        {
          icon: "Target",
          label: "Adaptive Convergence",
          explanation: "Non-linear inertia weight decay (0.9 to 0.4) balances exploration in early iterations with exploitation refinement in later stages.",
          example: "High inertia enables broad exploration initially; low inertia allows precise optimization near the end.",
          tip: (
            <>
              <span className="font-semibold">Quadratic decay</span> formula for smooth convergence behavior.
            </>
          ),
        },
      ],
    },



    methodsReferences: {
  title: "Methods",
  icon: "BookOpen",
  items: [
    {
      icon: "FileText",
      label: (
        <a
          href="https://doi.org/10.1155/2013/860289"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[44] Martins Akugbe Arasomwan and A. O. Adewumi, \"On the Performance of Linear Decreasing Inertia Weight Particle Swarm Optimization for Global Optimization,\" The Scientific World JOURNAL, vol. 2013, pp. 1–12, Jan. 2013, doi: 10.1155/2013/860289.",
      tip: (
        <>
          Validates our <span className="font-semibold">0.9 → 0.4 inertia decay</span> range.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://doi.org/10.1016/j.neucom.2021.03.077"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[6] X. Li, K. Mao, F. Lin, and X. Zhang, \"Particle swarm optimization with state-based adaptive velocity limit strategy,\" Neurocomputing, vol. 447, pp. 64–79, Mar. 2021, doi: 10.1016/j.neucom.2021.03.077.",
      tip: (
        <>
          Supports <span className="font-semibold">dynamic velocity limits</span> (6.0 → 1.0).
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://doi.org/10.1155/2016/6469721"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[45] P. Li and H. Zhu, \"Parameter Selection for Ant Colony Algorithm Based on Bacterial Foraging Algorithm,\" Mathematical Problems in Engineering, vol. 2016, pp. 1–12, 2016, doi: 10.1155/2016/6469721.",
      tip: (
        <>
          Justifies <span className="font-semibold">α=1.0, β=2.0</span> parameter choices.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://link.springer.com/chapter/10.1007/978-3-030-81462-5_6"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[4] A. Daniel, N. Partheeban, and S. Sriramulu, \"Enhanced Ant Colony Optimization Algorithm for Optimizing Load Balancing in Cloud Computing Platform,\" in Computational Intelligence in Data Science, Springer, 2021, pp. 64–70.",
      tip: (
        <>
          Demonstrates <span className="font-semibold">load-based pheromone</span> reinforcement.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://doi.org/10.3390/sym16060661"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[40] J. Tang, G. Liu, Q. Qi, and Q. Pan, \"Enhanced Particle Swarm Optimization for Task Scheduling in Cloud Computing Environments,\" Symmetry, vol. 16, no. 6, p. 661, 2024.",
      tip: (
        <>
          Recent validation of <span className="font-semibold">EPSO effectiveness</span> in cloud scheduling.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://arxiv.org/abs/2408.13386"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[5] Andreoli, R., Zhao, J., Cucinotta, T., & Buyya, R. (2025, January 20). CloudSim 7G: An integrated toolkit for modeling and simulation of Future Generation Cloud Computing Environments. arXiv.org. https://arxiv.org/abs/2408.13386.",
      tip: (
        <>
          Our <span className="font-semibold">simulation platform</span> for algorithm evaluation.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://www.researchgate.net/publication/341123014_Borg_the_next_generation"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[14] Borg: The next generation - researchgate. 2020. https://www.researchgate.net/publication/341123014_Borg_the_next_generation",
      tip: (
        <>
          Real-world <span className="font-semibold">workload data</span> for testing.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://doi.org/10.1186/s13677-023-00453-3"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[3] J. Zhou et al., \"Comparative analysis of metaheuristic load balancing algorithms for efficient load balancing in cloud computing,\" Journal of Cloud Computing: Advances, Systems and Applications, vol. 12, no. 85, pp. 1–21, Jun. 2023, doi: 10.1186/s13677-023-00453-3.",
      tip: (
        <>
          Comprehensive <span className="font-semibold">algorithm comparison</span> framework.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://doi.org/10.3390/s22030920"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[2] A. Khan et al., \"AdPSO: Adaptive PSO-Based Task Scheduling Approach for Cloud Computing,\" Sensors, vol. 22, no. 3, p. 920, 2022.",
      tip: (
        <>
          Validates <span className="font-semibold">adaptive parameter strategies</span>.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://doi.org/10.3390/a14020029"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[39] A. A. Al-Moalmi, J. Luo, A. Salah, and K. Li, \"Task scheduling in cloud computing using hybrid meta-heuristic: a two-way approach,\" Algorithms, vol. 14, no. 2, p. 29, 2021.",
      tip: (
        <>
          Explores <span className="font-semibold">hybrid algorithm</span> approaches.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://doi.org/10.1016/j.jpdc.2020.04.008"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[21] A. Devaraj, M. Elhoseny, S. Dhanasekaran, E. Lydia, and K. Shankar, \"Hybridization of firefly and Improved Multi-Objective Particle Swarm Optimization algorithm for energy efficient load balancing in Cloud Computing environments,\" J. Parallel Distrib. Comput., vol. 142, pp. 36-45, Aug. 2020.",
      tip: (
        <>
          Multi-objective <span className="font-semibold">energy optimization</span> strategies.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://doi.org/10.1007/s10462-024-10925-w"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[16] N. Devi et al., \"A systematic literature review for load balancing and task scheduling techniques in cloud computing,\" Artificial Intelligence Review, vol. 57, no. 10, Sep. 2024, doi: 10.1007/s10462-024-10925-w.",
      tip: (
        <>
          Comprehensive <span className="font-semibold">state-of-the-art</span> review.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="http://www.softcomputing.net/nabic11_7.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[50] Inertia weight strategies in particle swarm optimization, http://www.softcomputing.net/nabic11_7.pdf (accessed Nov. 8, 2025).",
      tip: (
        <>
          Educational resource on <span className="font-semibold">PSO fundamentals</span>.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://algorithmafternoon.com/books/particle_swarm/chapter04/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
         View
        </a>
      ),
      explanation: "[51] \"Chapter 4 - parameter tuning and its effects,\" Chapter 4 - Parameter Tuning and Its Effects | Algorithm Afternoon, https://algorithmafternoon.com/books/particle_swarm/chapter04/ (accessed Nov. 8, 2025).",
      tip: (
        <>
          Practical <span className="font-semibold">parameter selection</span> guidance.
        </>
      ),
    },
    {
      icon: "FileText",
      label: (
        <a
          href="https://algorithmafternoon.com/ants/ant_system/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View
        </a>
      ),
      explanation: "[53] \"Ant System,\" Ant System | Algorithm Afternoon, https://algorithmafternoon.com/ants/ant_system/ (accessed Nov. 8, 2025).",
      tip: (
        <>
          Core <span className="font-semibold">ACO algorithm</span> principles and implementation.
        </>
      ),
    },
  ],
},


    references: {
      title: "Resources",
      description: "Additional materials and knowledge on the algorithms.",
      icon: "ExternalLink",
      items: [
        {
          icon: "ExternalLink",
          label: "Particle Swarm Optimization Overview",
          explanation: "Technical overview of PSO algorithms.",
          tip: (
            <a
              href="https://www.techscience.com/cmc/v82n2/59521/html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View
            </a>
          ),
        },
        {
          icon: "ExternalLink",
          label: "Ant Colony Optimization Guide",
          explanation: "Tutorial on ACO algorithms with implementation examples.",
          tip: (
            <a
              href="https://algorithmafternoon.com/ants/ant_system/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View
            </a>
          ),
        },
      ],
    },
  },
};
