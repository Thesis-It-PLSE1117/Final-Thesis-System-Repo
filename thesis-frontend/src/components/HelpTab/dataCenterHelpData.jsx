export const dataCenterHelpContent = {
  title: "Data Center Configuration",
  description: (
    <>
      Set up your cloud with <span className="font-semibold">hosts</span> (physical servers) and <span className="font-semibold">VMs</span> (virtual machines). 
      Hosts supply CPU, memory, and storage. VMs use these resources to run your tasks.
    </>
  ),
  icon: "Server",

  quickStart: {
    title: "Quick Start Example",
    description: "Use this simple setup to run your first simulation:",
    example: {
      hosts: "20 hosts",
      pesPerHost: "8 cores",
      peMips: "2500 MIPS",
      hostRam: "4096 MB",
      vms: "50 VMs",
      vmPes: "2 cores per VM",
    },
    note: "This default setup has 20 servers and 50 VMs. It balances resources well.",
  },

  sections: {
    hostConfig: {
      title: "Host Configuration",
      description: (
        <>
          Hosts are the <span className="font-semibold">physical servers</span> that power your VMs.
        </>
      ),
      icon: "HardDriveUpload",
      items: [
        {
          icon: "Server",
          label: "Number of Hosts",
          explanation: "How many physical servers to create.",
          example: "Default: 20 hosts (10-80 in presets).",
          tip: (
            <>
              <span className="font-semibold">More hosts</span> = better load distribution.
            </>
          ),
        },
        {
          icon: "Cpu",
          label: "PEs per Host",
          explanation: "CPU cores each server has.",
          example: "Default: 8 cores (4-16 in presets).",
          tip: (
            <>
              Must be <span className="font-semibold">≥ total VM PEs</span> per host.
            </>
          ),
        },
        {
          icon: "Gauge",
          label: "PE MIPS",
          explanation: "CPU speed in Million Instructions Per Second.",
          example: "Default: 2500 MIPS (2000-3500 in presets).",
          tip: (
            <>
              <span className="font-semibold">Higher</span> = faster task completion.
            </>
          ),
        },
        {
          icon: "MemoryStick",
          label: "RAM per Host",
          explanation: "Memory in MB for all VMs on this host.",
          example: "Default: 4096 MB (2048-32768 in presets).",
          tip: (
            <>
              Must be <span className="font-semibold">≥ total VM RAM</span> per host.
            </>
          ),
        },
        {
          icon: "Network",
          label: "Bandwidth",
          explanation: "Network speed in Mbps.",
          example: "Typical: 1000-10000 Mbps.",
          tip: (
            <>
              <span className="font-semibold">Shared</span> among all VMs on host.
            </>
          ),
        },
        {
          icon: "Disc",
          label: "Storage",
          explanation: "Disk space in MB.",
          example: "Typical: 10000-100000 MB.",
          tip: (
            <>
              Must be <span className="font-semibold">≥ total VM storage</span> per host.
            </>
          ),
        },
      ],
    },

    vmConfig: {
      title: "Virtual Machine Configuration",
      description: (
        <>
          VMs run on hosts and execute your tasks using the <span className="font-semibold">resources you assign</span>.
        </>
      ),
      icon: "HardDriveDownload",
      items: [
        {
          icon: "HardDrive",
          label: "Number of VMs",
          explanation: "How many virtual machines to create.",
          example: "Default: 50 VMs (20-320 in presets).",
          tip: (
            <>
              System <span className="font-semibold">auto-assigns</span> VMs to hosts.
            </>
          ),
        },
        {
          icon: "Gauge",
          label: "VM MIPS",
          explanation: "CPU speed each VM requests.",
          example: "Default: 1000 MIPS (800-2000 in presets).",
          tip: (
            <>
              Should <span className="font-semibold">not exceed</span> host PE MIPS.
            </>
          ),
        },
        {
          icon: "Cpu",
          label: "VM PEs",
          explanation: "CPU cores each VM needs.",
          example: "Default: 2 cores (1-4 in presets).",
          tip: (
            <>
              Total VM PEs <span className="font-semibold">≤</span> host PEs.
            </>
          ),
        },
        {
          icon: "MemoryStick",
          label: "VM RAM",
          explanation: "Memory each VM requests in MB.",
          example: "Default: 1024 MB (512-4096 in presets).",
          tip: (
            <>
              Total VM RAM <span className="font-semibold">≤</span> host RAM.
            </>
          ),
        },
        {
          icon: "Network",
          label: "VM Bandwidth",
          explanation: "Network speed each VM needs in Mbps.",
          example: "Typical: 100-1000 Mbps.",
          tip: "Used for task data transfers.",
        },
        {
          icon: "Database",
          label: "VM Size",
          explanation: "Storage space each VM needs in MB.",
          example: "Typical: 1000-10000 MB.",
          tip: "Used for VM image and task data.",
        },
      ],
    },

    troubleshooting: {
      title: "Common Issues",
      description: "Here are fixes for common setup problems:",
      icon: "Settings",
      items: [
        {
          icon: "AlertCircle",
          problem: "VMs fail to start.",
          solution: (
            <>
              Check that <span className="font-semibold">total VM resources don't exceed</span> host capacity.
            </>
          ),
          example: "If host has 4 cores, don't create 5 VMs with 1 core each.",
        },
        {
          icon: "AlertCircle",
          problem: "Slow simulation.",
          solution: (
            <>
              <span className="font-semibold">Reduce</span> number of hosts/VMs or <span className="font-semibold">increase MIPS</span> values.
            </>
          ),
          example: "Try the 1K tasks preset (10 hosts, 20 VMs) for faster simulation.",
        },
        {
          icon: "AlertCircle",
          problem: "Resource allocation error.",
          solution: (
            <>
              Ensure <span className="font-semibold">VM requirements are less than</span> host capacity.
            </>
          ),
          example: "VM RAM (2000 MB) must be < Host RAM (8000 MB).",
        },
      ],
    },

    glossary: {
      title: "Key Terms",
      description: "Important concepts in simple terms:",
      icon: "BookOpen",
      terms: [
        {
          term: "Host",
          definition: (
            <>
              A <span className="font-semibold">physical server</span> that provides resources to VMs.
            </>
          ),
        },
        {
          term: "VM (Virtual Machine)",
          definition: (
            <>
              A <span className="font-semibold">virtualized computer</span> that runs on a host and executes tasks.
            </>
          ),
        },
        {
          term: "PE (Processing Element)",
          definition: (
            <>
              A <span className="font-semibold">CPU core</span> that processes instructions.
            </>
          ),
        },
        {
          term: "MIPS",
          definition: (
            <>
              <span className="font-semibold">Million Instructions Per Second</span> - measures CPU speed.
            </>
          ),
        },
        {
          term: "Cloudlet",
          definition: (
            <>
              A <span className="font-semibold">task or job</span> that VMs execute.
            </>
          ),
        },
        {
          term: "Time-shared scheduling",
          definition: (
            <>
              Multiple tasks <span className="font-semibold">share CPU time</span> fairly.
            </>
          ),
        },
      ],
    },
  },
};
