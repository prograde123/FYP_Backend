#include<iostream>
using namespace std;

//method declarations
void display(int**, int); //displays graph
int** initGraph(int**, char*, int); //initialize graph
void displayVertices(char*,bool*, int); //it will display vertices
void displayVisited(bool*, int);
int main(){
	
	
	//declaring and initializing vertices array
	int noVertices;
	cout << "" ;
	cin>>noVertices;
	
	char* vertices = new char[noVertices];
	//now declaring and initializing visited array
	bool* visited = new bool[noVertices];
	
	for(int i=0; i<noVertices; i++){
		cout << "" ;
		cin>>vertices[i];
		visited[i] = false;
	}
	
	cout << "" ;
	//displaying vertices array	
	displayVertices(vertices,visited, noVertices);	
	
	//now declaring our graph
	int** graph = new int*[noVertices];
	for(int i=0; i<noVertices; i++){
		graph[i] = new int[noVertices];
	}
	
	//initing graph
	graph = initGraph(graph, vertices, noVertices);
	
	
	//displaying graph
	display(graph, noVertices);

	
	return 0;
}
void display(int**graph, int noVertices){
		cout << "" <<endl;
	for(int i=0; i<noVertices; i++){
		for(int j=0; j<noVertices; j++){
			cout<<graph[i][j]<<" ";
		}
		cout<<endl;
	}
		
}
int** initGraph(int**graph, char* vertices, int noVertices){
	//ask user for connections
	for(int i=0; i<noVertices; i++){
		for(int j=0; j<noVertices; j++){
			cout << "" <<vertices[i]<<" , "<<vertices[j]<<": ";
			cin>>graph[i][j];
		}
	}
	return graph;
}
void displayVertices(char* vertices,bool* visited,  int size){
	for(int i=0; i<size; i++){
		cout<<vertices[i]<<"  VISITED :"<<visited[i]<<"\n";
	}
	cout<<endl;
}

void displayVisited(bool* visited, int size){
	for(int i=0; i<size; i++){
		cout<<visited[i]<<endl;
	}
}


