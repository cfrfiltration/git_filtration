
# coding: utf-8

# In[ ]:

def polarization_efficiency(alpha,N_P):
    import numpy as np
    import scipy.constants as sc
    pi = sc.pi
    y0 = 1/(-0.004063492380144-2.011495730139445/np.log(alpha))
    A = np.sqrt(2.012885180741874+4.073576984482692*np.log(alpha)+4.044387094856756*np.log(alpha)**2)
    z = -0.586384632534379+0.021877822063434*np.log(alpha)-1.155977436252566/np.log(alpha)-0.567605324153254/np.log(alpha)**2
    w = 0.598376917101962+0.073583862439683*np.log(alpha)-0.626911083949947/np.log(alpha)
    s1 = np.sqrt((-3.403501482374785-0.100203258687107*np.log(alpha)**2)/(1-2.139486394701941*np.log(alpha)**2))
    s2 = (-59.168621907302440-74.999999995136020*np.log(alpha)**2)/(1-17.282575437671620*np.log(alpha)**2+0.260382225937685*np.log(alpha)**4)
    x =  np.log(np.log(alpha**(-5/2)/N_P))
    pearson_IV = (A*(1+s2**2/(4*s1**2))**s1*np.exp(-s2*(np.arctan((x-w*s2/(2*s1)-z)/w)+np.arctan(s2/(2*s1))))/
    (1+(x-w*s2/(2*s1)-z)**2/w**2)**s1)+y0
    theta_b = pi/(1+np.exp(-pearson_IV)*N_P)
    eta_P = 1/np.sqrt(alpha)*np.sin(theta_b)+alpha**2*N_P*(pi-theta_b)
    return eta_P

