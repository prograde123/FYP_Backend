#include <stdio.h>

/* Function to reverse arr[] from start to end*/
void rvereseArray(int arr[], int start, int end) {
    int temp;
    while (start < end) {
        temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;
        start++;
        end--;
    }
}

/* Utility that prints out an array on a line */
void printArray(int arr[], int size) {
    int i;
    for (i = 0; i < size; i++)
        printf("%d ", arr[i]);

    printf("\n");
}

/* Driver function to test above functions */
int main() {
    int n;
    printf("");
    scanf("%d", &n);

    int arr[n];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    rvereseArray(arr, 0, n - 1);
    printArray(arr, n);

    return 0;
}
