
# coding: utf-8

# In[ ]:

def single_fiber_efficiency(alpha,Pe,N_R,N_P,N_C,N_I,d_f,d_f_delta_p):
    import numpy as np
    import interception_efficiency as eta_R
    import diffusion_efficiency as eta_D
    import polarization_efficiency as eta_P
    import coulombic_efficiency as eta_C

    Ku = -1/2*np.log(alpha)-3/4+alpha-alpha**2/4
    eta_R = eta_R.interception_efficiency(alpha,Ku,N_R)
    eta_D = eta_D.diffusion_efficiency(alpha,Ku,Pe,d_f,d_f_delta_p)
    eta_P = eta_P.polarization_efficiency(alpha,N_P)
    eta_C = eta_C.coulombic_efficiency(alpha,Ku,N_C)
    eta_total = eta_R+eta_D+eta_P+eta_C
    return eta_total

