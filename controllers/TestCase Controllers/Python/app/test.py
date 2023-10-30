def is_odd_even(number):
    if not isinstance(number, int):
        return "Invalid"
    
    if number % 2 == 0:
        return "Even"
    else:
        return "Odd"

def test_is_odd_even():
    # Test even numbers
    assert is_odd_even(0) == "Even"
    assert is_odd_even(4) == "Even"
    assert is_odd_even(100) == "Even"

    # Test odd numbers
    assert is_odd_even(1) == "Odd"
    assert is_odd_even(7) == "Odd"
    assert is_odd_even(99) == "Odd"

    # Test negative numbers
    assert is_odd_even(-2) == "Even"
    assert is_odd_even(-7) == "Odd"
    assert is_odd_even(-101) == "Odd"

    # Test large numbers
    assert is_odd_even(1000000) == "Even"
    assert is_odd_even(999999) == "Odd"
    assert is_odd_even(123456789) == "Odd"

    # Test decimal numbers (considered as invalid inputs)
    assert is_odd_even(3.14) == "Invalid"
    assert is_odd_even(10.5) == "Invalid"
    assert is_odd_even(-8.7) == "Invalid"

    # Test non-integer inputs (considered as invalid inputs)
    assert is_odd_even("Hello") == "Invalid"
    assert is_odd_even([1, 2, 3]) == "Invalid"
    assert is_odd_even(None) == "Invalid"

    print("All test cases passed!")

# Run the test cases
test_is_odd_even()
