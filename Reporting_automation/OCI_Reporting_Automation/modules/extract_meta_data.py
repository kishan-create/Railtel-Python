from functools import partial
from multiprocessing.dummy import Pool
from subprocess import call
from subprocess import Popen
import modules.extract_functions as e
import modules.json_to_csv as json
import pandas as pd
import csv

def main():

    print("Gathering meta data...")

    # Creat shapes list
    create_shapes()

    run_commands_1() # Outputed as json file
    json.json_to_csv(json.combine_jsons_1()) # Covert json to csv

    run_commands_2()
    json.json_to_csv(json.combine_jsons_2())

    run_commands_3()
    json.json_to_csv(json.combine_jsons_3())    

    run_commands_4()
    json.json_to_csv(json.combine_jsons_4()) 

    # run_commands_5()
    # json.json_to_csv(json.combine_jsons_5()) 

def concurrent_commands(commands):
    pool = Pool(5) # Five concurrent commands at a time
    for i, returncode in enumerate(pool.imap(partial(call, shell=True), commands)):
        if returncode != 0:
            print("%d command failed: %d" % (i, returncode))

def run_commands_1():
    
    # OCI CLI commands
    commands = [
        "echo \" - Getting compartment list...\"",
        "oci iam compartment list --all > ../results/compartments/compartments.json", # Get compartments list
        "echo \" - Getting availability_domain list...\"",
        "oci iam availability-domain list > ../results/availability_domain/availability_domain.json"] # Get availability domains list

    # Run commands
    concurrent_commands(commands)

def run_commands_2():

    # Get datasets
    compartments = pd.read_csv("../results/compile/compartments.csv")

    for index, row in compartments.iterrows():
        print("Extracting information for " + row["name.compartments"] + "...")
        concurrent_commands(create_extract_commands_2(row["id.compartments"], row["name.compartments"]))

def run_commands_3():

    # Get datasets
    instances = pd.read_csv("../results/compile/instances.csv")
    boot = pd.read_csv("../results/compile/boot.csv")
    volume = pd.read_csv("../results/compile/volume.csv")

    # Remove duplicate image ocid from column image.id.instances and keep the first occurrence.
    images = instances.drop_duplicates(subset=['image-id.instances'], keep='first')

    commands = []

    # # Image List
    # print("Getting images list...")
    # for index, row in images.iterrows():
    #     commands.append("oci compute image get --image-id " + row["image-id.instances"] + " > ../results/images/images" + str(index) + ".json")

    # VNIC List
    print("Getting vnic list...")
    for index, row in instances.iterrows():
        commands.append("oci compute instance list-vnics --instance-id " + row["id.instances"] + " --all > ../results/vnic/vnic" + str(index) + ".json")

    concurrent_commands(commands)

def run_commands_4():

    # Get datasets
    compartments = pd.read_csv("../results/compile/compartments.csv")

    for index, row in compartments.iterrows():
        print("Extracting information for " + row["name.compartments"] + "...")
        concurrent_commands(create_extract_commands_4(row["id.compartments"], row["name.compartments"]))

# def run_commands_5():

#     nodes = pd.read_csv("../results/compile/nodes.csv")
#     subnet = pd.read_csv("../results/compile/subnet.csv")

#     commands = []

#     commands.append("echo \" - Getting nodes_ip list...\"")
#     for index, row in nodes.iterrows():
#         commands.append("oci network vnic get --vnic-id " + row["vnic-id.nodes"] + " > ../results/nodes_ip/nodes_ip" + str(index) + ".json")

#     commands.append("echo \" - Getting private_ip list...\"")
#     for index, row in subnet.iterrows():
#         commands.append("oci network private-ip list --subnet-id " + row["id.subnet"] + " --all > ../results/private_ip/private_ip" + str(index) + ".json")

#     concurrent_commands(commands)

def create_extract_commands_2(compartment_ocid="", compartment_name=""):

    availability_domain = pd.read_csv("../results/compile/availability_domain.csv")

    commands = []

    # Instance List
    commands.append("echo \" - Getting instance list...\"")
    commands.append("oci compute instance list -c " + compartment_ocid + " --all > ../results/instances/instances_" + compartment_name + ".json")

    # VNIC Attached List
    commands.append("echo \" - Getting vnic_attached list...\"")
    commands.append("oci compute vnic-attachment list -c " + compartment_ocid + " --all > ../results/vnic_attached/vnic_attached_" + compartment_name + ".json")

    # Block Volume Attached List
    commands.append("echo \" - Getting volume_attached list...\"")
    commands.append("oci compute volume-attachment list -c " + compartment_ocid + " --all > ../results/volume_attached/volume_attached_" + compartment_name + ".json")

    # VCN List
    commands.append("echo \" - Getting vcn list...\"")
    commands.append("oci network vcn list -c " + compartment_ocid + " --all > ../results/vcn/vcn_" + compartment_name + ".json")

    # # Load Balancer List
    # commands.append("echo \" - Getting load_balancer list...\"")
    # commands.append("oci lb load-balancer list -c " + compartment_ocid + " --all > ../results/load_balancer/load_balancer_" + compartment_name + ".json")

    # Public IP list
    commands.append("echo \" - Getting public_ip list...\"")
    for index, row in availability_domain.iterrows():
        commands.append("oci network public-ip list --scope AVAILABILITY_DOMAIN  -c " + compartment_ocid + " --availability-domain " + row['name.availability_domain'] + " --all > ../results/public_ip/public_ip" + str(index) + "_" + compartment_name + ".json")

    # Boot Volume Attached List
    commands.append("echo \" - Getting boot_attached list...\"")
    for index, row in availability_domain.iterrows():
        commands.append("oci compute boot-volume-attachment list -c " + compartment_ocid + " --availability-domain " + row['name.availability_domain'] + " --all > ../results/boot_attached/boot_attached" + str(index) + "_" + compartment_name + ".json")

    # Boot Volume List
    commands.append("echo \" - Getting boot list...\"")
    for index, row in availability_domain.iterrows():
        commands.append("oci bv boot-volume list -c " + compartment_ocid + " --availability-domain " + row['name.availability_domain'] + " --all > ../results/boot/boot" + str(index) + "_" + compartment_name + ".json")
    
    # Block Volume List
    commands.append("echo \" - Getting volume list...\"")
    for index, row in availability_domain.iterrows():
        commands.append("oci bv volume list -c " + compartment_ocid + " --availability-domain " + row['name.availability_domain'] + " --all > ../results/volume/volume" + str(index) + "_" + compartment_name + ".json")

    return commands

def create_extract_commands_4(compartment_ocid="", compartment_name=""):

    # Get datasets
    vcn = pd.read_csv("../results/compile/vcn.csv")
    # dbass = pd.read_csv("../results/compile/dbaas.csv")

    commands = []
 
    commands.append("echo \" - Getting subnet list...\"")
    for index, row in vcn.iterrows():
        commands.append("oci network subnet list -c " + compartment_ocid + " --vcn-id " + row["id.vcn"] + " --all > ../results/subnet/subnet" + str(index) + "_" + compartment_name + ".json")

    # commands.append("echo \" - Getting nodes list...\"")
    # for index, row in dbass.iterrows():
    #     commands.append("oci db node list -c " + compartment_ocid + " --db-system-id " + row["id.dbaas"] + " --all > ../results/nodes/nodes" + str(index) + "_" + compartment_name + ".json")
    
    return commands

def create_shapes():

    print("Creating shapes...")

    # shape field names
    fields = ['oracle_shape', 'Cpus', 'memory']

    # shape information
    rows = [['BM.Standard1.36', '36', '256'],
            ['BM.Standard2.52', '52', '768'],
            ['BM.DenseIO1.36', '36', '512'],
            ['BM.DenseIO2.52', '52', '768'],
            ['VM.GPU2.1', '12', '104'],
            ['BM.GPU2.2', '28', '192'],
            ['VM.GPU3.1', '6', '90'],
            ['VM.GPU3.2', '12', '180'],
            ['VM.GPU3.4', '24', '360'],
            ['BM.GPU3.8', '52', '768'],
            ['VM.Standard1.1', '1', '7'],
            ['VM.Standard2.1', '1', '15'],
            ['VM.Standard1.2', '2', '14'],
            ['VM.Standard2.2', '2', '30'],
            ['VM.Standard1.4', '4', '28'],
            ['VM.Standard2.4', '4', '60'],
            ['VM.Standard1.8', '8', '56'],
            ['VM.Standard2.8', '8', '120'],
            ['VM.Standard1.16', '16', '112'],
            ['VM.Standard2.16', '16', '240'],
            ['VM.Standard2.24', '24', '320'],
            ['VM.DenseIO1.4', '4', '60'],
            ['VM.DenseIO1.8', '8', '120'],
            ['VM.DenseIO2.8', '8', '120'],
            ['VM.DenseIO1.16', '16', '240'],
            ['VM.DenseIO2.16', '16', '240'],
            ['VM.DenseIO2.24', '24', '320']]

    # name of csv file
    filename = "../results/compile/shapes.csv"

    with open(filename, 'w') as csvfile:
        # creating a csv writer object
        csvwriter = csv.writer(csvfile)

        # writing the fields
        csvwriter.writerow(fields)

        # writing the data rows
        csvwriter.writerows(rows)