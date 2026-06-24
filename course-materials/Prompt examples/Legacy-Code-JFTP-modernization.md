# Example prompt (dictated) to modernize legacy code

> Repo legacy: https://github.com/sai-pullabhotla/jftp/tree/master#

I am now in a very old Java project, in very old versions, which are no longer supported and which will not work here locally on this computer.

I want you to help me modernize this code and create a detailed plan for how we can do it step by step, so that this project works with modern versions of Java and with newer versions of libraries, and above all, so that it is run at all and you can use it again.

As part of this plan, it suggests that you take the following steps.
1. First of all, at the beginning analyze all the code and make detailed documentation for how this code looks at this moment. Describe all dependencies, describe versions, describe how it works, describe the architecture, make detailed documentation in multiple files. Also create Agents MD and Claude MD files that will describe specifically for the agents how they can work in this project, what is here, and what the structure of this project is.
It is very important that you emphasize in the instructions for the agents at Dica Agence that these files must be updated during the execution of the plan and during the modernization of the application, so that they are continuously in line with how this project actually looks. Documentation for something so detailed ww ww wzrb of files in Mardown in the DOX folder. However, documentation for the agents, split into multiple files in the individual parts of the system. Make one general Agent MD file at the main level of the project, whereas the detailed descriptions and instructions for the agents in the individual parts of the project, make it already inside deeper folders, concerning only specific code fragments data.

2. First, do detailed tests regarding the example four functionalities of this application; these can be unit tests that will check whether this application continues to work after our refactor. In these tests, focus on functionality, not on implementation first of all. That is, at the moment when we do the refactor, regardless of the implementation change, the test should still pass if the functionality works. 

3. Try to run this application with minimal changes. Introduce such changes that will be minimally needed for this application to start at the beginning. 

4. After the minimum startup and after the minimum changes needed to run this application, of course check whether the tests still pass. If they do not pass, you must fix something in the application and check whether this functionality was actually broken. Focus on fixing the code, not on fixing the tests. Assume initially that the code is wrong, not the tests.

5. At the moment when the application is being launched, and we have tests passing, in such a minimal version, after a minimal refactor of this application, to move on to the proper larger refactor, when updating the version, here various dependencies and also updating the code itself to newer Java standards, so that it is implemented in accordance with the latest guidelines, here related to Java and language standards.
