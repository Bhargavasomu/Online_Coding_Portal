#include<stdio.h>
#include<math.h>
#include<stdlib.h>
#include<string.h>
int cmp(const void *a, const void *b)
{
	return ( *(int*)a - *(int*)b );
}
int min(int a,int b)
{
	if(a<=b)
		return a;
	else
		return b;
}
int max(int a,int b)
{
	if(a>=b)
		return a;
	else
		return b;
}
int main()
{
	long long int i,k;
	k=0;
	for(i=0;i<1000000000000;i++)
	{
		//printf("Hello World\n");
		k++;
	}
	return 0;
}

