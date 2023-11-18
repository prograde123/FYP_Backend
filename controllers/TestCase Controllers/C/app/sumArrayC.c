#include <stdio.h>

int main() {
    int size, i;
    
    // Ask the user for the size of the array
    printf("");
    scanf("%d", &size);
    
    // Declare an array of the given size
    int arr[size];
    
    // Ask for array elements
    printf("");
    for (i = 0; i < size; i++) {
       
        scanf("%d", &arr[i]);
    }
    
    // Calculate the sum of array elements
    int sum = 0;
    for (i = 0; i < size; i++) {
        sum += arr[i];
    }
    
    // Display the sum
    printf("%d\n", sum);
    
    return 0;
}
