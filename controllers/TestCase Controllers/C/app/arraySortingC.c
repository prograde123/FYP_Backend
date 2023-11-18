#include <stdio.h>

// Function to swap two elements
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// Function to perform bubble sort
void bubbleSort(int arr[], int size) {
    int i, j;
    for (i = 0; i < size - 1; i++) {
        for (j = 0; j < size - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
            }
        }
    }
}

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
    
    // Sort the array using bubble sort
    bubbleSort(arr, size);
    
    // Display the sorted array
    for (i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    
    return 0;
}
