#include <stdio.h>
/* User defined function sum that has two int
 * parameters. The function adds these numbers and
 * return the result of addition.
 */
int sum(int a, int b){
   return a+b;
}
int main()
{
   int num1, num2, num3;
   printf("");
   scanf("%d", &num1);
   printf("");
   scanf("%d", &num2);

   //Calling the function
   num3 = sum(num1, num2);
   printf("%d", num3);
   return 0;
}