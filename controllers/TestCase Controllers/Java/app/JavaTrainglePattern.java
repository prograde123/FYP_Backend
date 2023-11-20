import java.util.Scanner;

public class HollowTrianglePattern {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter the number of rows for the triangle: ");
        int rows = scanner.nextInt();

        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= 2 * rows - 1; j++) {
                if (i == rows || j == rows - i + 1 || j == rows + i - 1) {
                    System.out.print("");
                } else {
                    System.out.print(" ");
                }
            }
            System.out.println();
        }
    }
}
