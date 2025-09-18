export const dataCenterHelpContent = {
  title: "Data Center Configuration",
  description: "Configure your virtual data center environment with hosts and virtual machines. These settings determine the computing resources available for your cloud simulation. Based on CloudSim concepts, hosts represent physical servers while VMs are virtualized instances that run on these hosts.",
  icon: "Server",
  sections: {
    hostConfig: {
      title: "Host Configuration",
      description: "Hosts represent the physical servers in your data center that will run virtual machines. In CloudSim terminology, hosts are characterized by their processing elements (PEs), memory, storage, and bandwidth capabilities.",
      icon: "HardDriveUpload",
      items: [
        { 
          icon: "Server", 
          text: "Number of Hosts: Defines how many physical servers are available in your data center. Each host can run multiple VMs depending on its capacity and the VM requirements." 
        },
        { 
          icon: "Cpu", 
          text: "PEs per Host: Specifies the number of Processing Elements (CPU cores) available on each host. Each PE has a defined capacity measured in MIPS (Million Instructions Per Second)." 
        },
        { 
          icon: "Gauge", 
          text: "PE MIPS: Sets the computing power of each Processing Element in Million Instructions Per Second. This determines how quickly a host can execute computational tasks." 
        },
        { 
          icon: "MemoryStick", 
          text: "RAM per Host: Allocates memory (in MB) available on each physical host. This memory is shared among all VMs running on the host." 
        },
        { 
          icon: "Network", 
          text: "Bandwidth per Host: Defines the network bandwidth capacity (in Mbps) for each host. This affects data transfer rates between VMs and external networks." 
        },
        { 
          icon: "Disc", 
          text: "Storage per Host: Sets the storage capacity (in MB) available on each host. This storage is used for VM images and other persistent data." 
        }
      ]
    },
    vmConfig: {
      title: "Virtual Machine Configuration",
      description: "Virtual Machines are the virtualized computing instances that will be deployed on your physical hosts. In CloudSim, VMs have specific resource requirements and can run cloudlets (computational tasks).",
      icon: "HardDriveDownload",
      items: [
        { 
          icon: "HardDrive", 
          text: "Number of VMs: Determines how many virtual machines will be created and deployed across hosts. VMs are allocated to hosts based on available resources." 
        },
        { 
          icon: "Gauge", 
          text: "VM MIPS: Sets the computing power (in MIPS) that each virtual machine can utilize. This determines the VM's processing capability for executing tasks." 
        },
        { 
          icon: "Cpu", 
          text: "VM PEs: Defines the number of virtual Processing Elements (vCPUs) allocated to each VM. Each vCPU can process instructions concurrently." 
        },
        { 
          icon: "MemoryStick", 
          text: "VM RAM: Allocates memory (in MB) available to each virtual machine. This memory is dedicated to the VM and not shared with others." 
        },
        { 
          icon: "Network", 
          text: "VM Bandwidth: Sets the network bandwidth (in Mbps) allocated to each virtual machine. This affects the VM's communication capabilities." 
        },
        { 
          icon: "Database", 
          text: "VM Size: Defines the storage space (in MB) allocated to each virtual machine. This storage is used for the VM's operating system and applications." 
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