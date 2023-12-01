
line = int(input(""))


for a in range(1, line+1):
    for j in range(1,line-a+1):
        print(" ", end="")
    for j in range(1, 2*a):
        print("*", end="")
    print()

for b in range(line-1,0, -1):
    for l in range(1,line-b+1):
        print(" ", end="")
    for l in range(1, 2*b):
        print("*", end="")
    print()