export const dataCenterHelpContent = {
  title: "Data Center Configuration",
  description: "Set up your simulated cloud infrastructure using CloudSim components. Hosts represent physical servers with CPU cores (Processing Elements), memory, and storage. Virtual Machines run on these hosts and execute the scheduled tasks (cloudlets). All components use time-shared scheduling for realistic resource sharing.",
  icon: "Server",
  sections: {
    hostConfig: {
      title: "Host Configuration",
      description: "Hosts are simulated physical servers that provide resources to Virtual Machines. Each host has Processing Elements (CPU cores), RAM, storage, and network bandwidth. The system uses time-shared scheduling to allocate host resources among VMs fairly.",
      icon: "HardDriveUpload",
      items: [
        { 
          icon: "Server", 
          text: "Number of Hosts: How many simulated physical servers to create. Each host will be allocated VMs automatically based on available resources and scheduling policies." 
        },
        { 
          icon: "Cpu", 
          text: "PEs per Host: Number of CPU cores (Processing Elements) each server has. More cores allow a host to run more VMs simultaneously with better performance." 
        },
        { 
          icon: "Gauge", 
          text: "PE MIPS: Computing speed of each CPU core in Million Instructions Per Second. Higher MIPS means tasks complete faster. Typical values: 1000-3000 MIPS." 
        },
        { 
          icon: "MemoryStick", 
          text: "RAM per Host: Total memory in MB that each host provides to its VMs. VMs share this memory pool through the RamProvisionerSimple allocation policy." 
        },
        { 
          icon: "Network", 
          text: "Bandwidth per Host: Network capacity in Mbps for data transfers. Managed by BwProvisionerSimple to fairly distribute bandwidth among VMs on the host." 
        },
        { 
          icon: "Disc", 
          text: "Storage per Host: Disk space in MB available for VMs. Used for VM images and data storage. Each host provides this capacity to all its VMs." 
        }
      ]
    },
    vmConfig: {
      title: "Virtual Machine Configuration",
      description: "Virtual Machines are created on hosts and execute cloudlets (tasks). Each VM requests specific amounts of CPU, memory, storage, and bandwidth from its host. The system uses Xen virtualization model with time-shared cloudlet scheduling for realistic task execution.",
      icon: "HardDriveDownload",
      items: [
        { 
          icon: "HardDrive", 
          text: "Number of VMs: How many virtual machines to create. The system automatically assigns them to hosts using VmAllocationPolicySimple based on resource availability." 
        },
        { 
          icon: "Gauge", 
          text: "VM MIPS: Processing speed each VM requests from its host. Should not exceed the host's PE MIPS capacity. Used to calculate task execution times." 
        },
        { 
          icon: "Cpu", 
          text: "VM PEs: How many CPU cores (vCPUs) each VM needs from its host. Must not exceed the host's available PEs for successful VM creation." 
        },
        { 
          icon: "MemoryStick", 
          text: "VM RAM: Memory in MB that each VM requests from its host. Total VM memory on a host cannot exceed the host's available RAM." 
        },
        { 
          icon: "Network", 
          text: "VM Bandwidth: Network capacity in Mbps each VM needs. Used for task data transfers and communication between VMs and the network." 
        },
        { 
          icon: "Database", 
          text: "VM Size: Storage space in MB each VM requires. Used for the VM image and temporary task data during cloudlet execution." 
        }
      ]
    },
    visualization: {
      title: "Visualization Features",
      description: "The interface provides visual feedback to help you understand resource allocation and distribution based on CloudSim's modeling approach.",
      icon: "Columns",
      items: [
        { 
          icon: "Server", 
          text: "Host cards display resource utilization metrics including CPU, memory, storage, and bandwidth usage percentages, and show which VMs are running on each host" 
        },
        { 
          icon: "HardDrive", 
          text: "VM cards show detailed configuration and current status (running, paused, completed) of each virtual machine along with resource consumption" 
        },
        { 
          icon: "List", 
          text: "Click on any VM in the distribution view to see its detailed specifications, current tasks, and resource usage statistics" 
        },
        { 
          icon: "Settings", 
          text: "All sections can be collapsed or expanded to customize your view and focus on relevant information. Configuration panels allow real-time parameter adjustment" 
        }
      ]
    }
  }
};