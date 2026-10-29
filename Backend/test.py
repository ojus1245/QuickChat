def square_root(x):
    start=0
    end=x
    while start<=end:
        mid=(start+end)//2
        if int(mid*mid)==x:
            return mid
        elif mid*mid>x:
            end=mid
        else:
            start=mid+1
            
print(int(square_root(15)))