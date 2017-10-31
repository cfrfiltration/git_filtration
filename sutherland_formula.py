
# coding: utf-8

# In[ ]:

def sutherland_formula(T):
    T_ref = 296.15
    mu_ref = 1.83245E-5
    return mu_ref*(T/T_ref)**1.5*(T_ref+110.4)/(T+110.4)

