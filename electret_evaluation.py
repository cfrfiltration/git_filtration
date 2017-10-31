
# coding: utf-8

# In[ ]:

def electret_evaluation(alpha,d_f,d_f_delta_p,h,epsilon_f,sigma_0,lambda_g,T,mu_g,rho_g,U_0,epsilon_g,d_p,d_p_start,d_p_end,epsilon_p,
                        n_input):

    import scipy.constants as sc
    import numpy as np
    import math
    import scipy.optimize as so
    import single_fiber_efficiency as eta_total
    import wiedensohler_charge_distribution as f_n

    k_B = sc.k
    e = sc.e
    epsilon_0 = sc.epsilon_0
    pi = sc.pi

    U = U_0/(1-alpha)
    Re_f = rho_g*U*d_f/mu_g
    Kn_f = 2*lambda_g/d_f
    if Re_f > 1 and Kn_f > 1:
        warning = 'Re_f > 1 and Kn_f > 1'
    elif Re_f > 1:
        warning = 'Re_f > 1'
    elif Kn_f > 1:
        warning = 'Kn_f > 1'
    else:
        warning = ''
    delta_p = (16*mu_g*alpha*U*h*(1+1.996*Kn_f)/
               (d_f**2*(-3/4-1/2*np.log(alpha)+alpha-1/4*alpha**2+0.998*Kn_f*(-1/2-np.log(alpha)+1/2*alpha**2))))

# because we could load files, I passed a string to tell the code to load a locally saved datafile
    if isinstance(sigma_0, str) == True:
        M = np.loadtxt('datafile.txt', dtype='float', delimiter="\t", skiprows=1)
        d_p = M[:,0]
        P = M[:,1]
        eta_exp = -pi*(1-alpha)*d_f/(4*alpha*h)*np.log(P)
        N_R = d_p/d_f
        Kn_p = 2*lambda_g/d_p
        C = 1+Kn_p*(1.165+0.483*np.exp(-0.997/Kn_p))
        D = k_B*T*C/(3*mu_g*d_p)
        Pe =  U*d_f/D
        N_I = ((epsilon_f-epsilon_g)/(epsilon_f+epsilon_g)*q**2*C/
               (12*pi**2*epsilon_0*epsilon_g*mu_g*U*d_p*d_f**2))
        def fit_charge_density(d_p,sigma_0_fit):

            N_P = (2/3*(epsilon_p-epsilon_g)/(epsilon_p+2*epsilon_g)*epsilon_g*sigma_0_fit**2*d_p**2*C/
                   (epsilon_0*(epsilon_f+epsilon_g)**2*mu_g*U*d_f))
            N_C = sigma_0_fit*q*C/(3*pi*epsilon_0*(epsilon_f+epsilon_g)*mu_g*U*d_p)
            eta = eta_total.single_fiber_efficiency(alpha,Pe,N_R,N_P,N_C,N_I,d_f,d_f_delta_p)
            return eta

            P = np.exp(-4*alpha*h*eta/(pi*d_f*(1-alpha)))
            E = 1-P

        results = {'E': filter_efficiency(d_p)}

        return results
 # if there was no string input values were used       
    else:
        def evaluate_single_fiber_efficiency(d_p,n):
            q = np.absolute(n)*e
            N_R = d_p/d_f
            Kn_p = 2*lambda_g/d_p
            C = 1+Kn_p*(1.165+0.483*np.exp(-0.997/Kn_p))
            D = k_B*T*C/(3*mu_g*d_p)
            Pe =  U*d_f/D
            N_P = (2/3*(epsilon_p-epsilon_g)/(epsilon_p+2*epsilon_g)*epsilon_g*sigma_0**2*d_p**2*C/
                   (epsilon_0*(epsilon_f+epsilon_g)**2*mu_g*U*d_f))
            N_I = ((epsilon_f-epsilon_g)/(epsilon_f+epsilon_g)*q**2*C/
                   (12*pi**2*epsilon_0*epsilon_g*mu_g*U*d_p*d_f**2))
            N_C = sigma_0*q*C/(3*pi*epsilon_0*(epsilon_f+epsilon_g)*mu_g*U*d_p)
            eta = eta_total.single_fiber_efficiency(alpha,Pe,N_R,N_P,N_C,N_I,d_f,d_f_delta_p)
            return eta

        def penetration(d_p,n_input):
            if isinstance(n_input,str):
                n = np.atleast_2d(np.arange(-11,12))
                P = np.transpose(np.atleast_2d(np.sum(f_n.wiedensohler_charge_distribution(T,d_p,n)*
                           np.exp(-4*alpha*h*evaluate_single_fiber_efficiency(d_p,n)/(pi*d_f*(1-alpha))),axis=1)))
            else:
                n = n_input
                P = np.exp(-4*alpha*h*evaluate_single_fiber_efficiency(d_p,n)/(pi*d_f*(1-alpha)))
            return P
    
        #MPPS = so.minimize_scalar(evaluate_single_fiber_efficiency,bounds=(d_p_start,d_p_end),method='bounded')

        results = {'P': penetration(d_p,n_input), 'delta_p': delta_p, 'Re_f': Re_f, 'Kn_f': Kn_f, 'warning': warning}

        return results


