def extract_string(text):
    extract = text.split('"')[1::2]
    return extract[0]

def extract_details(find=""):
    with open("../config") as file:
        read = file.readlines()
        for items in read:
            if items.find(find) > -1:
                file.close()
                return extract_string(items)

# def define_fields(find=""):
#
#     with open("../config") as file:
#         # read = file.readlines()
#
#         for items in file:
#             # print(items)
#             if items.find(find + " = ") > -1:
#                 if items.lower().find("true") > -1:
#                     return True
#                     # if check_dependent_fields(items.lower(), file) == True:
#                     #     return True
#                     # else:
#                     #     return False
#                 else:
#                     return False
#
# def check_dependent_fields(items, file):
#     print(file.readline())
#     # read = file.readlines()
#
#     dependent_fields = {
#         "vnic" : "instance",
#         "boot_attached" : "volume",
#         "boot_backup" : "boot",
#         "default_route" : "vcn",
#         "security_list" : "vcn",
#         "internet_gateway" : "vcn",
#         "subnet" : "vcn",
#         "nodes" : "dbass"
#     }
#
#     for key, value in dependent_fields.items():
#
#         if key.find(items):
#             for lines in file:
#                 if lines.find(value + " = ") > -1:
#                     if lines.find("true") > -1:
#                         return True
#                     else:
#                         return False
#
#         else:
#             return True
