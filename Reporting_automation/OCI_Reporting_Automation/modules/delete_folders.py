import shutil
import os

def main():

    print("Deleting folders...")

    for folder in folders():
        # If folder exists, delete it
        try:
            if os.path.exists("../results/" + folder):
                shutil.rmtree("../results/" + folder)
        except:
            pass

def folders():

    commands = []
    commands.append("backup")
    commands.append("boot")
    commands.append("boot_attached")
    commands.append("bucket")
    commands.append("default_route")
    commands.append("drg")
    commands.append("drg_attachment")
    commands.append("fast_connect")
    commands.append("images")
    commands.append("instances")
    commands.append("internet_gateway")
    commands.append("load_balancer")
    commands.append("public_ip")
    commands.append("security_list")
    commands.append("subnet")
    commands.append("vcn")
    commands.append("virtual_circuit")
    commands.append("vnic")
    commands.append("vnic_attached")
    commands.append("volume")
    commands.append("volume_attached")
    commands.append("volume_backup")
    commands.append("volume_backup_policy")
    commands.append("dbaas")
    commands.append("nodes")
    commands.append("nodes_ip")
    commands.append("private_ip")
    commands.append("billable_report")
    commands.append("boot_backup")
    commands.append("boot_backup_volumes")
    commands.append("shape")
    commands.append("compartments")
    commands.append("availability_domain")
    commands.append("default_route_rules")

    return commands
