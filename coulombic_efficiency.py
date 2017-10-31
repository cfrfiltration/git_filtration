
# coding: utf-8

# In[ ]:

def coulombic_efficiency(alpha,Ku,N_C):
    import scipy.constants as sc
    pi = sc.pi
    eta_C = ((1-alpha)/Ku)**(1/8)*pi*N_C/(1+2*pi*N_C**(1/4))
    return eta_C