#include <iostream>
using namespace std;

int main() {
  int number;
  cout << "" ;
  cin >> number;
  
  // right arrow
  for (int i = 0; i <= number; i++) {
    for (int j = 0; j < number; j++) {
      if (i == number/2 || j - i == number/2 || i + j == number/2 *3)
        cout << "*";
      else 
        cout << " ";
    }
    cout << endl;
  }
  cout << "" ;
  return 0;
}