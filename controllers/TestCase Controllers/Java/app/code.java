import java.util.Scanner;

public class ArraySum {
    public static void main(String[] args) {
        int[] numbers = new int[4]; // Create an array of size 4
        int sum = 0;
        
        Scanner scanner = new Scanner(System.in);
       
        // Read user input and store it in the array
        for (int i = 0; i < 4; i++) {
            System.out.print("Enter number: ");
            numbers[i] = scanner.nextInt();
        }

        // Calculate the sum of the numbers in the array
        for (int i = 0; i < 4; i++) {
            sum += numbers[i];
        }

        // Display the sum
        System.out.println(sum);
        
        // Close the scanner
        scanner.close();
    }
}
