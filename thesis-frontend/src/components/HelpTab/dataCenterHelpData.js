export const dataCenterHelpContent = {
  title: "Data Center Configuration",
  description:
    "Configure your cloud infrastructure with hosts (physical servers) and VMs (virtual machines). Hosts provide CPU, memory, and storage resources that VMs use to execute tasks.",
  icon: "Server",

  quickStart: {
    title: "Quick Start Example",
    description: "Try this basic configuration for your first simulation:",
    example: {
      hosts: "2 hosts",
      pesPerHost: "4 cores",
      peMips: "2000 MIPS",
      hostRam: "8000 MB",
      vms: "4 VMs",
      vmPes: "2 cores per VM",
    },
    note: "This creates 2 physical servers with 4 VMs that can run multiple tasks simultaneously.",
  },

  sections: {
    hostConfig: {
      title: "Host Configuration",
      description: "Hosts are physical servers that provide resources to VMs.",
      icon: "HardDriveUpload",
      items: [
        {
          icon: "Server",
          label: "Number of Hosts",
          explanation: "How many physical servers to create",
          example: "Typical: 2-10 hosts",
          tip: "More hosts = better load distribution",
        },
        {
          icon: "Cpu",
          label: "PEs per Host",
          explanation: "CPU cores each server has",
          example: "Typical: 2-8 cores",
          tip: "Must be ≥ total VM PEs per host",
        },
        {
          icon: "Gauge",
          label: "PE MIPS",
          explanation: "CPU speed in Million Instructions Per Second",
          example: "Typical: 1000-3000 MIPS",
          tip: "Higher = faster task completion",
        },
        {
          icon: "MemoryStick",
          label: "RAM per Host",
          explanation: "Memory in MB for all VMs on this host",
          example: "Typical: 4000-16000 MB",
          tip: "Must be ≥ total VM RAM per host",
        },
        {
          icon: "Network",
          label: "Bandwidth",
          explanation: "Network speed in Mbps",
          example: "Typical: 1000-10000 Mbps",
          tip: "Shared among all VMs on host",
        },
        {
          icon: "Disc",
          label: "Storage",
          explanation: "Disk space in MB",
          example: "Typical: 10000-100000 MB",
          tip: "Must be ≥ total VM storage per host",
        },
      ],
    },

    vmConfig: {
      title: "Virtual Machine Configuration",
      description:
        "VMs run on hosts and execute your tasks using allocated resources.",
      icon: "HardDriveDownload",
      items: [
        {
          icon: "HardDrive",
          label: "Number of VMs",
          explanation: "How many virtual machines to create",
          example: "Typical: 2-20 VMs",
          tip: "System auto-assigns VMs to hosts",
        },
        {
          icon: "Gauge",
          label: "VM MIPS",
          explanation: "CPU speed each VM requests",
          example: "Typical: 500-2000 MIPS",
          tip: "Should not exceed host PE MIPS",
        },
        {
          icon: "Cpu",
          label: "VM PEs",
          explanation: "CPU cores each VM needs",
          example: "Typical: 1-4 cores",
          tip: "Total VM PEs ≤ host PEs",
        },
        {
          icon: "MemoryStick",
          label: "VM RAM",
          explanation: "Memory each VM requests in MB",
          example: "Typical: 512-4000 MB",
          tip: "Total VM RAM ≤ host RAM",
        },
        {
          icon: "Network",
          label: "VM Bandwidth",
          explanation: "Network speed each VM needs in Mbps",
          example: "Typical: 100-1000 Mbps",
          tip: "Used for task data transfers",
        },
        {
          icon: "Database",
          label: "VM Size",
          explanation: "Storage space each VM needs in MB",
          example: "Typical: 1000-10000 MB",
          tip: "Used for VM image and task data",
        },
      ],
    },

    troubleshooting: {
      title: "Common Issues",
      description: "Solutions to frequent configuration problems:",
      icon: "Settings",
      items: [
        {
          icon: "AlertCircle",
          problem: "VMs fail to start",
          solution: "Check that total VM resources don't exceed host capacity",
          example: "If host has 4 cores, don't create 5 VMs with 1 core each",
        },
        {
          icon: "AlertCircle",
          problem: "Slow simulation",
          solution: "Reduce number of hosts/VMs or increase MIPS values",
          example: "Try 2 hosts with 4 VMs instead of 10 hosts with 20 VMs",
        },
        {
          icon: "AlertCircle",
          problem: "Resource allocation error",
          solution: "Ensure VM requirements are less than host capacity",
          example: "VM RAM (2000 MB) must be < Host RAM (8000 MB)",
        },
      ],
    },

    glossary: {
      title: "Key Terms",
      description: "Important concepts explained simply:",
      icon: "BookOpen",
      terms: [
        {
          term: "Host",
          definition: "A physical server that provides resources to VMs",
        },
        {
          term: "VM (Virtual Machine)",
          definition:
            "A virtualized computer that runs on a host and executes tasks",
        },
        {
          term: "PE (Processing Element)",
          definition: "A CPU core that processes instructions",
        },
        {
          term: "MIPS",
          definition: "Million Instructions Per Second - measures CPU speed",
        },
        {
          term: "Cloudlet",
          definition: "A task or job that VMs execute",
        },
        {
          term: "Time-shared scheduling",
          definition: "Multiple tasks share CPU time fairly",
        },
      ],
    },
  },
};
