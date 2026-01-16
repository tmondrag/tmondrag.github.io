# Smooth Interpolation Weighting Functions
Interpolating data in a domain in which data is only known for a number of points in the domain can be done with a linear weighting function, but that leaves sharp corners in the interpolated data where the known data sits. If this is undesirable, what would usually be required is that the interpolated data have zero derivative or gradient at the known data points.

## Regularly spaced data
### 1-D 
A 1-D space with regularly spaced data points can be scaled up or down so that the space between data points is 1.0. Doing that, given any test point in between two known data points, the distance between the test point and either one of the nearest known data points is at most 1.0 and at least 0.0. The weighting function itself need to vary between 0.0 and 1.0, and it needs to lend more weight to data points that are closer to the test point than to data points that ar farther away. So, a smooth interpolation weighting function $f(x)$ would fit the constraints:
$$
\tag{1}
\begin{matrix}
f(x) &=& 1 & \text{if } x = 0 \\
f(x) &=& 0 & \text{if } x = 1 \\
\dfrac{d f(x)}{d x} &=& 0 & \text{if } x \in \{0,1\}
\end{matrix}
$$

These four constraints could be satisfied by a third degree polynomial
$$\tag{2} 
\begin{matrix}
 f(x)                              &=&  a_3 x^3 &+  a_2 x^2 &+ a_1 x &+ a_0 \\
 \dfrac{d f(x)}{d x} &=& 3a_3 x^2 &+ 2a_2 x   &+ a_1   & 
\end{matrix}
$$

Applying the constraints $(1)$ to the polynomial and its derivative $(2)$ results in the relation
$$ \tag{3}
\begin{pmatrix}
1 \\ 0 \\ 0 \\ 0
\end{pmatrix} =
\begin{pmatrix}
0 & 0 & 0 & 1 \\ 
1 & 1 & 1 & 1 \\ 
0 & 0 & 1 & 0 \\
3 & 2 & 1 & 0
\end{pmatrix}
\begin{pmatrix}
a_3 \\ a_2 \\ a_1 \\ a_0
\end{pmatrix}
$$
which has the solution
$$ \tag{4}
\begin{pmatrix}
2 \\ -3 \\ 0 \\ 1
\end{pmatrix} =
\begin{pmatrix}
a_3 \\ a_2 \\ a_1 \\ a_0
\end{pmatrix}
$$

meaning the polynomial that fits the constraints is
$$\tag{5} f(x) = 2 x^3 - 3 x^2 + 1$$
which does fulfil the requirements of the smooth weighting function we wanted, but is not the function typically used in the computer graphics and visualization industry. When this function is used for interpolation, it can still look too pointy in renderings. What looks better is if there is more of a plateau near $x=0$ and $x=1$, and this is achieved by constraining the second derivative

$$ \tag{6} \dfrac{d f^2(x)}{d x^2} = 0  \text{ if } x \in \{0,1\}$$

which leads to the industry standard
$$ \tag{7} f(x) = -6 x^5 + 15 x^4 - 10 x^3 + 1 $$

So, that leaves us with some choices for interpolation weighting functions depending on how much computing power we want to dedicate to a smooth interpolation. Constraining more derivatives doesn't result in a smoother function. More isn't always better. There are other constraints that could be more useful, like 

$$ \tag{8} f(x)=1-f(1-x) $$ 

So, the options for interpolation weighting formulas are
$$
\boxed{
    f(x) = 
    \begin{cases}
    \begin{cases}
    1 & \text{} x \in [0,\frac{1}{2}) \\
    0 & \text{} x \in (\frac{1}{2},1]
    \end{cases} & \text{cheap but blocky} \\
    1 - x & \text{cheap but pointy} \\
    1 + 2x^3 - 3x^2 & \text{smooth but still too pointy for some} \\
    1 - 6x^5 + 15x^4 - 10x^3 & \text{industry standard smoothness} 
    \end{cases}
}
$$

It is often beneficial to constrain the first derivative at the ends to something other than 0. If 
$$\tag{9}
\begin{matrix}
\dfrac{d f(x)}{d x} = b_0 & \text{if } x=0 \\
\dfrac{d f(x)}{d x} = b_1 & \text{if } x=1
\end{matrix}
$$

then the more general solutions are

$$
\boxed{
    f(x) = 
    \begin{cases}
    \begin{cases}
    1 & \text{} x \in [0,\frac{1}{2}) \\
    0 & \text{} x \in (\frac{1}{2},1]
    \end{cases} & \text{cheap but blocky} \\
    1 - x & \text{cheap but pointy} \\
    1 + (2 + b_0 + b_1)x^3 + (-3 - 2 b_0 - b_1)x^2 + b_0 x & \text{smooth but still too pointy for some} \\
    1 + (-6 - 3 b_0 - 3 b_1)x^5 + (15 + 8 b_0 + 7 b_1)x^4 + (-10 - 6 b_0 - 4 b_1)x^3 + b_0 x & \text{industry standard smoothness} 
    \end{cases}
}
$$
#### 1-D Application
Suppose an interpolated data value $y(x)$ needs to be calculated for a data set where $ x_0 \le x \le x_1 $, $ x_1-x_0 = \Delta$, $y_0 = y(x_0)$, and $ y_1 = y(x_1) $. The interpolated value $y(x)$ is

$$\tag{10}
\begin{matrix}
y(x) &=& 
\dfrac{
    \sum{y_i*f\left(\frac{|x-x_i|}{\Delta}\right)}
}{
    \sum{f\left(\frac{|x-x_i|}{\Delta}\right)}
} & \text{for }i \in \{0,1\}
\end{matrix}
$$
If 
$$
\left. \dfrac{d f(x)}{d x} \right|_{x=0} = 
\left. \dfrac{d f(x)}{d x} \right|_{x=1}
$$
then the interpolation simplifies to
$$ \tag{11}
y(x)=y_1-(y_1-y_0)*f\left(\frac{|x-x_0|}{\Delta}\right)
$$

This should make it obvious that the shape of the weighting function is going to be applied to the interval. This may not be a desirable result and is a good reason to use a spline instead of a weighting function.

### 2-D 
On a 2-D regularly spaced rectangular grid, the interpolation weighting function for 1-D spaces could be adequate when applied to the distance between a test point and the four nearest neighbors with known data. The centroid of the unit square is still less than one unit of distance away from the corners of the square. This is still true in 3-D, but in 4-D, the centroid of a unit hypercube is exactly one unit away from the corners of the hypercube. As the dimensionality of a regularly spaced grid increases, the less justifiable it is to use the 1-D weighting functions, since the 1-D formula will only cover part of the unit hypercube. Instead, it might be better to figure out a weighting formula suited for each space that covers the whole unitary space, in this case the unit square.

The edges of a unit square are 1-D spaces though, so maybe it is best if the weighting formula reduces to the 1-D formula along those edges
$$\tag{12}
\begin{matrix}
f(x,y) & = & 1 - 6 x^5 + 15 x^4 - 10 x^3 & \text{if } x \in [0,1], y = 0 \\
f(x,y) & = & 1 - 6 y^5 + 15 y^4 - 10 y^3 & \text{if } y \in [0,1], x = 0 \\
f(x,y) & = & 0                           & \text{if } x \in [0,1], y = 1 \\
f(x,y) & = & 0                           & \text{if } y \in [0,1], x = 1 \\
\dfrac{\partial f(x,y)}{\partial x} &=& 0 & \text{if } x \in [0,1] , y = 1\\
\dfrac{\partial f(x,y)}{\partial x} &=& 0 & \text{if } y \in [0,1] , x \in \{0,1\}\\
\dfrac{\partial f(x,y)}{\partial y} &=& 0 & \text{if } y \in [0,1] , x = 1 \\
\dfrac{\partial f(x,y)}{\partial y} &=& 0 & \text{if } x \in [0,1] , y \in \{0,1\}
\end{matrix} 
$$
These ten constraints are satisfied by the following function and its derivatives
$$\tag{13}
\begin{matrix*}[l]
f(x,y) &=& (1 - 6x^5 + 15x^4 - 10x^3)(1 - 6y^5 + 15y^4 - 10y^3) \\
\dfrac{\partial f(x,y)}{\partial x} &=& (- 30x^4 + 60x^3 - 30x^3)(1 - 6y^5 + 15y^4 - 10y^3) \\
\dfrac{\partial f(x,y)}{\partial y} &=& (1 - 6x^5 + 15x^4 - 10x^3)(-30y^4 + 60y^3 - 30y^2)
\end{matrix*}
$$

![3D plot of the 2D smooth interpolator weighting function for regularly spaced rectangular grids from equation listing (9)](images/2DSmoothInterpolationWeightFunc.png "Plot of f(x,y) = (1 - 6x^5 + 15x^4 - 10x^3)(1 - 6y^5 + 15y^4 - 10y^3)")

The variables $x$ and $y$ in this case are relative measurements, not absolute coordinates. For a regulary spaced square grid of data points, where the points are spaced out by a distance $\Delta$, the weight that the data at point $(x_o,y_o)$ should have on the interpolated value at point $(x_p,y_p)$ should be the function $f(x,y)$ in $(9)$ with

$$\tag{14}
\begin{matrix}
x = \dfrac{|x_o - x_p|}{\Delta} \\
y = \dfrac{|y_o - y_p|}{\Delta}
\end{matrix}
$$

#### 2-D Application
For a point $(x,y)$ where $x_0 \le x \le x_1$, $y_0 \le y \le y_1$, $ x_1-x_0 = y_1-y_0 = \Delta$ and
$$
\begin{matrix}
z(x_0,y_0)&=&z_{0,0} \\
z(x_0,y_1)&=&z_{0,1} \\
z(x_1,y_0)&=&z_{1,0} \\
z(x_1,y_1)&=&z_{1,1} 
\end{matrix}
$$
Then the interpolated value $z(x,y)$ is

$$\tag{15}
\begin{matrix}
z(x,y) &=& 
\dfrac
{\sum{z_{i,j}*f\left(\frac{|x-x_i|}{\Delta}\right)*f\left(\frac{|y-y_j|}{\Delta}\right)}}
{\sum{f\left(\frac{|x-x_i|}{\Delta}\right)*f\left(\frac{|y-y_j|}{\Delta}\right)} } &
\text{for } i,j \in \{0,1\}
\end{matrix}
$$

### 3-D Regularly spaced cubic grid of data
In 3-D space, a smooth interpolation weighting formula that covers the whole unit cube can be obtained by the same method as was used in the 2-D case to cover the unit cube
$$\tag{16}
f(x,y,z) = f(x)*f(y)*f(z)
$$
### 4-D and higher dimensions
I am sure you see the trend by now. Just keep multiplying the 1-D interpolation weight for every coordinate rather than using the cartesian distance to the corners of the hypercube.
