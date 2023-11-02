def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        # Flag to optimize the algorithm by stopping early if no swaps are made
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap the elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # If no swaps were made in a pass, the array is already sorted
        if not swapped:
            break

# Taking input from the user one by one
try:
    n = 4
    array = []
    
    for i in range(n):
        element = int(input(""))
        array.append(element)

    bubble_sort(array)

    print(array)
except ValueError:
    print("Please enter valid integers.")
