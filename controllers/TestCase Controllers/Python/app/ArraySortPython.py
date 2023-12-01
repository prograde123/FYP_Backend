def sort_array():
    size = int(input(""))
    Newarray = []

    
    print("Enter the elements of the array:")
    for i in range(size):
        element = int(input(""))
        Newarray.append(element)

    
    Newarray.sort()

    
    print(Newarray)


sort_array()
