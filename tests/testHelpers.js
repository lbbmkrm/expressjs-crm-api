import app from "../src/app";
import request from "supertest";
import prisma from "../src/repositories/prismaClient";
export const setupUsers = async (prefix) => {
  try {
    const usersData = {
      admin: {
        username: `${prefix}_admin`,
        email: `${prefix}_admin@example.com`,
        password: "password123",
        token: "",
        id: null,
      },
      sales1: {
        username: `${prefix}_sales1`,
        email: `${prefix}_sales1@example.com`,
        password: "password123",
        token: "",
        id: null,
      },
      sales2: {
        username: `${prefix}_sales2`,
        email: `${prefix}_sales2@example.com`,
        password: "password123",
        token: "",
        id: null,
      },
      manager: {
        username: `${prefix}_manager`,
        email: `${prefix}_manager@example.com`,
        password: "password123",
        token: "",
        id: null,
      },
      viewer: {
        username: `${prefix}_viewer`,
        email: `${prefix}_viewer@example.com`,
        password: "password123",
        token: "",
        id: null,
      },
    };

    for (const key in usersData) {
      await request(app).post("/api/auth/register").send({
        username: usersData[key].username,
        email: usersData[key].email,
        password: usersData[key].password,
      });
    }

    await prisma.user.update({
      where: { username: usersData.admin.username },
      data: { role: "ADMIN" },
    });
    await prisma.user.update({
      where: { username: usersData.sales1.username },
      data: { role: "SALES" },
    });
    await prisma.user.update({
      where: { username: usersData.sales2.username },
      data: { role: "SALES" },
    });
    await prisma.user.update({
      where: { username: usersData.manager.username },
      data: { role: "MANAGER" },
    });
    await prisma.user.update({
      where: { username: usersData.viewer.username },
      data: { role: "VIEWER" },
    });

    for (const key in usersData) {
      const userRecord = await prisma.user.findUnique({
        where: { username: usersData[key].username },
        select: { id: true },
      });

      usersData[key].id = userRecord.id;

      const loginResponse = await request(app).post("/api/auth/login").send({
        emailOrUsername: usersData[key].username,
        password: usersData[key].password,
      });

      usersData[key].token = loginResponse.body.token;
    }

    return usersData;
  } catch (error) {
    console.error("Error setting up users", error);
  }
};

export const cleanupUsers = async (prefix) => {
  try {
    await prisma.user.deleteMany({
      where: {
        username: {
          startsWith: prefix,
        },
      },
    });
  } catch (error) {
    console.log("error cleaning up users", error);
  }
};

export const cleanupModels = async (prefix, models = []) => {
  try {
    const deleteOperation = {
      customer: async () => {
        await prisma.customer.deleteMany({
          where: {
            name: {
              startsWith: prefix,
            },
          },
        });
      },
      contact: async () => {
        await prisma.contact.deleteMany({
          where: {
            firstName: {
              startsWith: prefix,
            },
          },
        });
      },
      lead: async () => {
        await prisma.lead.deleteMany({
          where: {
            name: {
              startsWith: prefix,
            },
          },
        });
      },
      opportunity: async () => {
        await prisma.opportunity.deleteMany({
          where: {
            name: {
              startsWith: prefix,
            },
          },
        });
      },
      task: async () => {
        await prisma.task.deleteMany({
          where: {
            name: {
              startsWith: prefix,
            },
          },
        });
      },
      note: async () => {
        await prisma.note.deleteMany({
          where: {
            content: {
              startsWith: prefix,
            },
          },
        });
      },
      activity: async () => {
        await prisma.activity.deleteMany({
          where: {
            subject: {
              startsWith: prefix,
            },
          },
        });
      },
      product: async () => {
        await prisma.product.deleteMany({
          where: {
            name: {
              startsWith: prefix,
            },
          },
        });
      },
      ticket: async () => {
        await prisma.ticket.deleteMany({
          where: {
            subject: {
              startsWith: prefix,
            },
          },
        });
      },
      campaign: async () => {
        await prisma.campaign.deleteMany({
          where: {
            name: {
              startsWith: prefix,
            },
          },
        });
      },
    };
    for (const model of models) {
      if (deleteOperation[model]) {
        await deleteOperation[model]();
      }
    }
  } catch (error) {
    console.log("error cleaning up models", error);
  }
};
export const makeDate = (day) => {
  try {
    const time = new Date();
    time.setDate(time.getDate() + day);
    return time;
  } catch (error) {
    console.log("error making date", error);
  }
};

export const createCustomer = async (token, prefix) => {
  try {
    const response = await request(app)
      .post("/api/customers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: `${prefix}_Customer`,
        email: `${prefix}_cust@example.com`,
        phone: "1234567890",
        company: `${prefix}_Company`,
        address: `${prefix} Address St`,
      });
    return response.body.data;
  } catch (error) {
    console.log("error creating customer", error);
  }
};
export const createContact = async (token, prefix, customerId) => {
  try {
    const response = await request(app)
      .post("/api/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        customerId: customerId,
        firstName: `${prefix}_First`,
        lastName: `${prefix}_Last`,
        email: `${prefix}_cont@example.com`,
        phone: "1234567890",
        position: "Manager",
      });
    return response.body.data;
  } catch (error) {
    console.log("error creating contact", error);
  }
};

export const createLead = async (token, prefix, customerId = null) => {
  try {
    const leadData = {
      name: `${prefix}_Lead`,
      email: `${prefix}_lead@example.com`,
      phone: "1234567890",
      status: "NEW",
    };

    if (customerId) {
      leadData.customerId = customerId;
    }

    const response = await request(app)
      .post("/api/leads")
      .set("Authorization", `Bearer ${token}`)
      .send(leadData);
    return response.body.data;
  } catch (error) {
    console.log("error creating lead", error);
  }
};

export const createOpportunity = async (
  token,
  prefix,
  customerId = null,
  leadId = null
) => {
  try {
    const opportunityData = {
      name: `${prefix}_Opportunity`,
      amount: 10000.0,
      stage: "QUALIFICATION",
      description: `${prefix} opportunity description`,
    };

    if (customerId) {
      opportunityData.customerId = customerId;
    }
    if (leadId) {
      opportunityData.leadId = leadId;
    }

    const response = await request(app)
      .post("/api/opportunities")
      .set("Authorization", `Bearer ${token}`)
      .send(opportunityData);
    return response.body.data;
  } catch (error) {
    console.log("error creating opportunity", error);
  }
};

export const createTask = async (
  token,
  prefix,
  assignedToUserId,
  customerId = null,
  leadId = null,
  opportunityId = null
) => {
  try {
    const taskData = {
      name: `${prefix}_Task`,
      assignedToUserId: assignedToUserId,
      description: `${prefix}_Task_Description`,
      dueDate: makeDate(1),
    };

    if (customerId) {
      taskData.customerId = customerId;
    }
    if (leadId) {
      taskData.leadId = leadId;
    }
    if (opportunityId) {
      taskData.opportunityId = opportunityId;
    }

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(taskData);
    return response.body.data;
  } catch (error) {
    console.log("error creating task", error);
  }
};

export const createNote = async (
  token,
  prefix,
  customerId = null,
  contactId = null,
  leadId = null,
  opportunityId = null
) => {
  try {
    const noteData = {
      content: `${prefix}_Note`,
    };
    if (customerId) {
      noteData.customerId = customerId;
    }
    if (contactId) {
      noteData.contactId = contactId;
    }
    if (leadId) {
      noteData.leadId = leadId;
    }
    if (opportunityId) {
      noteData.opportunityId = opportunityId;
    }
    const response = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send(noteData);
    return response.body.data;
  } catch (error) {
    console.log("error creating note", error);
  }
};

export const createActivity = async (
  token,
  prefix,
  customerId = null,
  contactId = null,
  leadId = null,
  opportunityId = null
) => {
  try {
    const activityData = {
      type: "NOTE",
      subject: `${prefix}_Activity`,
      content: `${prefix}_Activity_Content`,
    };
    if (customerId) {
      activityData.customerId = customerId;
    }
    if (contactId) {
      activityData.contactId = contactId;
    }
    if (leadId) {
      activityData.leadId = leadId;
    }
    if (opportunityId) {
      activityData.opportunityId = opportunityId;
    }
    const response = await request(app)
      .post("/api/activities")
      .set("Authorization", `Bearer ${token}`)
      .send(activityData);
    return response.body.data;
  } catch (error) {
    console.log("error creating activity", error);
  }
};

export const createProduct = async (token, prefix, price = 1.0) => {
  try {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: `${prefix}_Product`, price: price });
    return response.body.data;
  } catch (error) {
    console.log("error creating product", error);
  }
};

export const createSale = async (
  token,
  customerId,
  productId,
  opportunityId = null
) => {
  try {
    const saleData = {
      customerId: customerId,
      items: [
        {
          productId: productId,
          quantity: 1,
        },
      ],
    };
    if (opportunityId) {
      saleData.opportunityId = opportunityId;
    }
    const response = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${token}`)
      .send(saleData);
    return response.body.data;
  } catch (error) {
    console.log("error creating sale", error);
  }
};

export const createUser = async (adminToken, prefix, role = "VIEWER") => {
  try {
    const response = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: `${prefix}_User`,
        email: `${prefix}@email.com`,
        password: "password123",
        role: role,
      });
    return response.body.data;
  } catch (error) {
    console.log("error creating user", error);
  }
};

export const createTicket = async (
  token,
  prefix,
  assignedUserId,
  customerId
) => {
  try {
    const response = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        assignedToUserId: assignedUserId,
        customerId: customerId,
        subject: `${prefix}_Ticket`,
        description: `${prefix}_Ticket_Description`,
      });
    return response.body.data;
  } catch (error) {
    console.log("error creating ticket", error);
  }
};

export const createCampaign = async (token, prefix) => {
  try {
    const response = await request(app)
      .post("/api/campaigns")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: `${prefix}_Campaign`,
        description: `${prefix}_Campaign_Description`,
        type: "OTHER",
        status: "PLANNING",
        startDate: makeDate(1),
        endDate: makeDate(2),
        budget: 1000,
      });
    return response.body.data;
  } catch (error) {
    console.log("error creating campaign", error);
  }
};
