#include <stdio.h>
#include <stdlib.h>

// Define a structure for a node
struct Node {
    int data;
    struct Node* next;
};

// Function to insert a new node at the beginning of the linked list
struct Node* insertAtBeginning(struct Node* head, int newData) {
    // Create a new node
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = newData;
    newNode->next = head; // Set the new node's next to the current head

    return newNode; // The new node becomes the new head
}

// Function to print the linked list
void printList(struct Node* head) {
    struct Node* current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");
}

int main() {
    struct Node* head = NULL; // Initialize an empty linked list

    int value, count = 0;
    while (count < 5) {
        scanf("%d", &value);

        if (value == 0) {
            break; // Exit the loop if the user enters 0
        }

        head = insertAtBeginning(head, value);
        count++;
    }

    // Print the linked list
    printList(head);

    return 0;
}