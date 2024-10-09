# Terraform-Oracle-Cloud-Infrastructure
This repository is dedicated to provisionning oracle cloud infrastructure via terraform tool
You should at least the following version : 
Terraform v0.12.24
+ provider.null v2.1.2
+ provider.oci v3.69.0

Put the mandatory informations in a setEnv.sh file in each directory. 
See setEnv.sh.example to find the correct entries
oci-main.tf contains information to store tfstate file in a bucket instead of a local file. 
Certs directory : should contain certificates and keystore used for load-balancer or java instances
cloudinit : should contain cloudinit script for instances
.oci : should contain private key
version.txt : contains the date of the latest update. 20.4.7 Means 2020 April 7th 

root-compartment : define groups, dynamic groups, policy and a demo-compartment
demo-compartment contains LB, compute, networks, db systems resources.

Each component type is described in a dedicated file (eg : db-createInstance.tf for database) and a dedicated variable file (db-vars.tf)
Map usage for variables is highly used to minimize the number of resources created

LPG Peering with remote network should be made manually

To use it quickly : 
- Rename resources, like demo-compartment, adm-app groups, ...
- Change only vcn and subnets on resource file and change any kind of values on "*-vars.tf" files.

Default compartment is named demo-compartment
Default Subnet and VCN are named vcn-tf1 and sub-vcn-tf1