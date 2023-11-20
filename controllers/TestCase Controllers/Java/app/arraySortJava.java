import java.util.Scanner;
import java.util.Arrays;

public class ArraySort {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Ask user for array size
        System.out.print("Enter the size of the array: ");
        int size = scanner.nextInt();

        // Create an array of given size
        int[] arr = new int[size];

        // Input elements of the array
        System.out.println("Enter the elements of the array:");
        for (int i = 0; i < size; i++) {
            arr[i] = scanner.nextInt();
        }

        // Sort the array
        Arrays.sort(arr);

        // Display the sorted array
        for (int i = 0; i < size; i++) {
            System.out.print(arr[i] + " ");
        }
    }
}
