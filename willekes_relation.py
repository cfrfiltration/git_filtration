
# coding: utf-8

# In[ ]:

def willekes_relation(p,T):
    T_ref = 296.15
    p_ref = 101.3E3
    lambda_ref = 67.3E-9
    return lambda_ref*(T/T_ref)*(p_ref/p)*(1+110.4/T_ref)/(1+110.4/T)

