import os

# Define the outputs
outputs = [
    "3 is prime",
    "4 is not prime",
    "6 is not prime",
    "1 is prime"
]

# Check if the count file exists
if not os.path.exists("count.txt"):
    with open("count.txt", "w") as f:
        f.write("0")

# Read the count
with open("count.txt", "r") as f:
    count = int(f.read())

# Print the corresponding message
if count < 4:
    x = input("")
    print(outputs[count])
else:
    print("No more outputs!")

# Update the count
count = (count + 1) % 5  # Reset to 0 after 4
with open("count.txt", "w") as f:
    f.write(str(count))
