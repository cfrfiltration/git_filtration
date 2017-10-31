
# coding: utf-8

# In[1]:

def polarization_interception_efficiency(alpha,N_R,N_P):
    import numpy as np
    import scipy as sp
    import scipy.io as si
    import scipy.constants as sc
    #from scipy.interpolate import Rbf
    from scipy.interpolate import griddata

    pi = sc.pi
    mat_contents = si.loadmat('theta_b_PR_results_3.mat')
    matrix = mat_contents['results']
    x = np.exp(np.transpose(matrix[:,0]))
    y = np.exp(np.transpose(matrix[:,1]))
    z = np.exp(np.transpose(matrix[:,2]))
    d = np.exp(np.transpose(matrix[:,3]))
    #rbfi = Rbf(x,y,z,d)
    xi = alpha*np.ones(N_R.size)
    yi = N_R
    zi = N_P
    di = griddata((x,y,z), d, (xi, yi, zi), method='linear')
    #di = rbfi(xi,yi,zi)
    theta_b = pi/(1+di)
    eta_PR_fit = 1/np.sqrt(alpha)*np.sin(theta_b)+alpha**2*N_P*(pi-theta_b)
    return eta_PR_fit


# In[ ]:



