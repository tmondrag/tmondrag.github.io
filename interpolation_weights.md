# Smooth Interpolation Weighting Functions
Interpolating data in a domain in which data is only known for a number of points in the domain can be done with a linear weighting funtion, but that leaves sharp corners in the interpolated data where the known data sits. If this is undesirable, what would usually be required is that the interpolated data have zero derivative or gradient at the known data points.

## Regulary spaced data
### 1-D
A 1-D space with regularly spaced data points can be scaled up or down so that the space between data points is 1.0. Doing that, given any test point in between two known data points, the distance between the test point and either one of the nearest known data points is at most 1.0 and at least 0.0. The weighting function itself need to vary between 0.0 and 1.0, and it needs to lend more weight to data points that are closer to the test point than to data points that ar farther away. So, a smooth interpolation weighting function $f(x)$ would fit the constraints:
$$
\tag{1}
\begin{matrix*}[l]
f(x) &=& 1 & \text{if } x = 0 \\
f(x) &=& 0 & \text{if } x = 1 \\
\dfrac{\partial f(x)}{\partial x} &=& 0 & \text{if } x \in \{0,1\}
\end{matrix*}
$$

These four constraints could be satisfied by a third degree polynomial
$$\tag{2} 
\begin{matrix*}[l]
 f(x)                              &=&  a_3 x^3 &+  a_2 x^2 &+ a_1 x &+ a_0 \\
 \dfrac{\partial f(x)}{\partial x} &=& 3a_3 x^2 &+ 2a_2 x   &+ a_1   & 
\end{matrix*}
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
\begin{pmatrix*}[r]
2 \\ -3 \\ 0 \\ 1
\end{pmatrix*} =
\begin{pmatrix}
a_3 \\ a_2 \\ a_1 \\ a_0
\end{pmatrix}
$$

meaning the polynomial that fits the constraints is
$$\tag{5} f(x) = 2 x^3 - 3 x^2 + 1$$
which does fulfil the requirements of the smooth weighting function we wanted, but is not the function typically used in the computer graphics and visualization industry. When this function is used for interpolation, it can still look too pointy in renderings. What looks better is if there is more of a plateau near $x=0$ and $x=1$, and this is achieved by constraining the second derivative

$$ \tag{6} \dfrac{\partial f^2(x)}{\partial x^2} = 0  \text{ if } x \in \{0,1\}$$

which leads to the industry standard
$$ \tag{7} f(x) = -6 x^5 + 15 x^4 - 10 x^3 + 1 $$

So, that leaves us with some choices for interpolation weighting functions depending on how much computing power we want to dedicate to a smooth interpolation. Constraining too many derivatives may result in an interpolation weight function that approaches the step function in the infinite limit, however, so at a certain point the interpolation will start looking blocky instead of pointy or smooth. More isn't always better.
$$
\boxed{
    f(x) = 
    \begin{cases}
    1 - x & \text{cheap but pointy} \\
    1 + 2x^3 - 3x^2 & \text{smooth but still too pointy for some} \\
    1 - 6x^5 + 15x^4 - 10x^3 & \text{industry standard smoothness} \\
    \qquad \vdots & \qquad \vdots \\
    \begin{cases}
    1 & \text{} x \in [0,\frac{1}{2}) \\
    0 & \text{} x \in (\frac{1}{2},1]
    \end{cases} & \text{cheap but blocky} 
    \end{cases}
}
$$
### 2-D
$$
\begin{matrix*}[l]
f(x,y) & = & 1 - 6 x^5 + 15 x^4 - 10 x^3 & \text{if } x \in [0,1], y = 0 \\
f(x,y) & = & 0                           & \text{if } x \in [0,1], y = 1 \\
f(x,y) & = & 1 - 6 y^5 + 15 y^4 - 10 y^3 & \text{if } y \in [0,1], x = 0 \\
f(x,y) & = & 0                           & \text{if } y \in [0,1], x = 1 \\
\dfrac{\partial f(x,y)}{\partial x} &=& 0 & \text{if } x \in [0,1] , y \in \{0,1\}\\
\dfrac{\partial f(x,y)}{\partial y} &=& 0 & \text{if } y \in [0,1] , x \in \{0,1\}
\end{matrix*} 
$$
### 3-D
## Irregularly spaced data
### 1-D
See the conversation about [1-D regularly spaced data](#1-d). The weighting interpolation function just needs to be scaled for each pair of neighboring datapoints.
### 2-D
### 3-D
