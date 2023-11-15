def main():
    try:
        # Get user input for the array elements
        array = []
        for i in range(4):
            element = int(input(""))
            array.append(element)

        # Calculate the sum of array elements
        array_sum = sum(array)

        print(array_sum)
    except ValueError:
        print("Invalid input. Please enter valid numbers.")

if __name__ == "__main__":
    main()
