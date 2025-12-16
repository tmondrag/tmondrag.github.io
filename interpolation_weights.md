# Smooth Interpolation Weighting Functions
Interpolating data in a domain in which data is only known for a number of points in the domain can be done with a linear weighting funtion, but that leaves sharp corners in the interpolated data where the known data sits. If this is undesirable, what would usually be required is that the interpolated data have zero derivative or gradient at the known data points.

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
\begin{matrix*}[l]
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
\end{pmatrix*} =
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
$$f(x)=1-f(1-x)$$ 
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
### 2-D
On a 2-D regularly spaced rectangular grid, the interpolation weighting function for 1-D spaces could be adequate when applied to the distance between a test point and the four nearest neighbors with know data. The centroid of the unit square is still less than one unit of distance away from the corners of the square. This is still true in 3-D, but in 4-D, the centroid of a unit hypercube is exactly one unit away from the corners of the hypercube. As the dimensionality of a reqularly spaced grid increases, the less justifiable it is to use the 1-D weighting functions, since the 1-d formula will only cover part of the unit hypercube. Instead, it might be better to figure out a weighting formula suited for each space that covers the whole unitary space, in this case the unit square.

The edges of a unit square are 1-D spaces though, so maybe it is best if the weighting formula reduces to the 1-D formula along those edges
$$\tag{8}
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
$$\tag{9}
\begin{matrix}
f(x,y) &=& (1 - 6x^5 + 15x^4 - 10x^3)(1 - 6y^5 + 15y^4 - 10y^3) \\
\dfrac{\partial f(x,y)}{\partial x} &=& (- 30x^4 + 60x^3 - 30x^3)(1 - 6y^5 + 15y^4 - 10y^3) \\
\dfrac{\partial f(x,y)}{\partial y} &=& (1 - 6x^5 + 15x^4 - 10x^3)(-30y^4 + 60y^3 - 30y^2)
 \end{matrix}
$$
### 3-D
In 3-D space, a smooth integration weighting formula that covers the whole unit cube can be obtained by the same method as was used in the 2-D case to cover the unit cube
$$
f(x,y,z) = (1 - 6x^5 + 15x^4 - 10x^3)(1 - 6y^5 + 15y^4 - 10y^3)(1 - 6z^5 + 15z^4 - 10z^3)
$$
### 4-D and higher dimensions
I am sure you see the trend by now. Just keep multiplying the 1-D interpolation weight for every coordinate rather that using the cartesian distance to the corners of the hypercube.

## Irregularly spaced data
### 1-D
See the conversation about [1-D regularly spaced data](#1-d). The weighting interpolation function just needs to be scaled for each pair of neighboring datapoints.
### 2-D
### 3-D
---
