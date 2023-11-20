def sort_array():
    size = int(input(""))
    arr = []

    # Taking array elements as input
    print("Enter the elements of the array:")
    for i in range(size):
        element = int(input(""))
        arr.append(element)

    # Sorting the array
    arr.sort()

    # Displaying the sorted array
    print(arr)

# Calling the function to sort the array
sort_array()
