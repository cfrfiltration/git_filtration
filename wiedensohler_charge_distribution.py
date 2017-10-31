
# coding: utf-8

# In[178]:

def wiedensohler_charge_distribution(T,d_p,n):

    import scipy.constants as sc
    import numpy as np
    import math

    k_B = sc.k
    e = sc.e
    epsilon_0 = sc.epsilon_0
    pi = sc.pi
    c_NI_ratio = 1
    Z_I_ratio = 0.875

    a = np.array([[-26.3328,-2.3197,-0.0003,-2.3484,-44.4756],
                  [35.9044,0.6175,-0.1014,0.6044,79.3772],
                  [-21.4608,0.6201,0.3073,0.4800,-62.8900],
                  [7.0867,-0.1105,-0.3372,0.0013,26.4492],
                  [-1.3088,-0.1260,0.1023,-0.1544,-5.7480],
                  [0.1051,0.0297,-0.0105,0.0320,0.5059]])
    i = np.arange(0,6)
    n_a = np.atleast_2d(np.arange(-2,3))
    f = np.zeros((d_p.shape[0],n.shape[1]))

    f_gunn = e/np.sqrt(4*pi**2*epsilon_0*d_p*k_B*T)*(np.exp(-(np.ones(d_p.shape)*n-2*pi*epsilon_0*d_p*np.ones(n.shape)*k_B*T/e**2*
                                                              math.log(c_NI_ratio*Z_I_ratio))**2/
                                                            (2*(2*pi*epsilon_0*d_p*np.ones(n.shape)*k_B*T)/e**2)))
    f_wiedensohler = np.power(10,np.sum(np.broadcast_to(np.transpose(a),(d_p.shape[0],a.shape[1],a.shape[0]))*
                                        np.log10((np.expand_dims(d_p*np.ones(a.shape[1]),axis=2)*np.ones(np.atleast_2d(i).shape))/
                                               sc.nano)**(np.ones([d_p.shape[0],a.shape[1],1])*np.atleast_2d(i)),axis=2))

    f[np.greater_equal(d_p,20e-9)*np.greater(np.absolute(n),2)] = f_gunn[np.greater_equal(d_p,20e-9)*np.greater(np.absolute(n),2)]
    f[np.greater_equal(d_p,20e-9)*np.less_equal(np.absolute(n),2)] = f_wiedensohler[np.greater_equal(d_p,20e-9)
                                                                                    *np.less_equal(np.absolute(n_a),2)]
    f[np.less(d_p,20e-9)*np.less(np.absolute(n),2)] = f_wiedensohler[np.less(d_p,20e-9)*np.less(np.absolute(n_a),2)]
    return f