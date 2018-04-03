#include<stdio.h>
#include<math.h>
#include<stdlib.h>
#include<string.h>
int main()
{
	int a,dig;
	long long int sum,mult;
	//scanf("%d",&a);
	a=10;
	sum=0;
	mult=1;
	while(a!=0)
	{
		dig=a%2;
		sum+=(mult*dig);
		mult=mult*10;
		a=a/2;
	}
	printf("%lld\n",sum);
	return 0;
}

