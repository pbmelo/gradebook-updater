#!/usr/bin/env python3

print("Type the week number of the desired recitation (e.g. 3):")
wk_num = input()
#wk_num = '3'
print("Type the path of the gradebook exported from Canvas (e.g. '2021-01-29T1424_Grades-PHYS_1110_Sp21.csv'):")
old_gradebook_path = input()
#old_gradebook_path = '2021-01-29T1424_Grades-PHYS_1110_Sp21.csv'
print("Type the paths for all rosters downloaded from Zoom (need to use unique participants, end with Ctrl+D):")
attendance_paths = []
while True:
    try:
        line = input()
        attendance_paths.append(line)
    except EOFError:
        break;
#attendance_paths = ['participants_7632002042(1).csv', 'participants_7632002042(2).csv', 'participants_7632002042.csv']
new_gradebook_path = 'Grades-PHYS_1110_Sp21-Updated.csv'

splitted = []
with open(old_gradebook_path,'r') as old_gradebook:
    first_line_list = old_gradebook.readline().split(',')
    student_names   = []
    student_ids     = []
    student_sis     = []
    student_login   = []
    student_section = []
    student_ta      = []
    student_grade   = []
    for each_line in old_gradebook:
        if each_line[0] == '"':
            splitted = each_line.split(',')
            student_names.append(splitted[0]+','+splitted[1])
            student_ids.append(splitted[2])
            student_sis.append(splitted[3])
            student_login.append(splitted[4])
            student_section.append(splitted[5])
            student_ta.append(splitted[6]+','+splitted[7])
            student_grade.append('0')

att_student_names = []
att_student_idkey = []
att_student_time  = []
for each_attendance_path in attendance_paths:
    with open(each_attendance_path,'r') as attendance:
        att_first_line = attendance.readline()
        for each_line in attendance:
            splitted = each_line.split(',')
            att_student_names.append(splitted[0])
            att_student_idkey.append(splitted[1].replace('@colorado.edu',''))
            att_student_time.append(splitted[2])

for each_idkey in att_student_idkey:
    if each_idkey in student_login:
        i = student_login.index(each_idkey)
        j = att_student_idkey.index(each_idkey)
        student_grade[i] = "4" if float(att_student_time[j]) >= 50.0 else str(int(5.0*float(att_student_time[j])/50.0))

this_wk_tut = [column_title for column_title in first_line_list if 'Week '+wk_num+' Tutorial' in column_title]
new_first_line = ','.join(first_line_list[0:6]+this_wk_tut)

with open(new_gradebook_path,'w') as new_gradebook:
    new_gradebook.write(new_first_line+'\n')
    new_gradebook.write(',,,,,,\n')
    for i in range(0,len(student_names)-1):
        new_gradebook.write(student_names[i]+','+student_ids[i]+','+student_sis[i]+','+student_login[i]+','+student_section[i]+','+student_ta[i]+','+student_grade[i]+'\n')

print("\nAn updated gradebook file called "+new_gradebook_path+" has been created.\n")
print("After uploading the new gradebook to Canvas, do not")
print("forget to check if grades have been assigned properly.")
print("It's common to have some buggy students in the gradebook.")
