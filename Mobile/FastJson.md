# Deserialization

```
serializedStr={"@type":"com.longofo.test.User","name":"lala","age":11, "flag": true,"sex":"boy","address":"china"}
-----------------------------------------------
 
 
JSON.parse(serializedStr)：
call User default Constructor
call User setName
call User setAge
call User setFlag
parse deserialize object name:com.longofo.test.User
parse deserialization：User{name='lala', age=11, flag=true, sex='boy', address='null'}
```

when u set a value like name: "lala" it's will call the setter function of User like setName("lala")