
# coding: utf-8

# In[ ]:

def air_density(p,T):
    import scipy.constants as sc
    R = sc.R
    M = 0.0289644 #kg/mol
    rho = p*M/(R*T)
    return rho

