
# coding: utf-8

# In[ ]:

def diffusion_efficiency(alpha,Ku,Pe,d_f,d_f_delta_p):
    import numpy as np
    eta_D_wang = 0.84*(d_f/d_f_delta_p)**0.57*((1-alpha)*Pe)**-0.43
    eta_D_stechkina = 2.9*Ku**(-1/3)*Pe**(-2/3)+0.62*Pe**-1
    eta_D = np.minimum(eta_D_stechkina,eta_D_wang)
    return eta_D

