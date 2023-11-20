#include <iostream>
#include <algorithm>

int main() {
    int size;
    std::cout << "" ;
    std::cin >> size;

    int arr[size];
    std::cout << ""  << size << " elements of the array:\n";
    for (int i = 0; i < size; ++i) {
        std::cin >> arr[i];
    }

    // Sorting the array
    std::sort(arr, arr + size);

    for (int i = 0; i < size; ++i) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;

    return 0;
}
