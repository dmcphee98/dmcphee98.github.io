import {
    SiTypescript, SiPython,
    SiReact, SiTailwindcss, SiRedux, SiMysql, SiRedis,
    SiDocker, SiSpring,
    SiGithubactions, SiJunit5, SiPrometheus,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";
import {
    AwsEc2, AwsLambda, AwsSqs, AwsEks, AwsCloudWatch, AwsCloudFormation, AwsRoute53,
    AwsS3, AwsRds, AwsApiGateway, AwsDynamoDb,
} from "@/components/icons/AwsIcons";
import { AnimatedJava, AnimatedReact, AnimatedAws } from "@/components/icons/AnimatedSkillIcons";
import type { SkillItem, FeaturedSkill } from "@/types/skills";

export const JOB_TITLES = [
    "Software Engineer",
    "Full Stack Developer",
    "Cloud Infra Enthusiast",
    "Prod Incident Responder",
    "System Design Enjoyer",
    "Unit Test Advocate",
    "Microservice Wrangler",
];

export const FEATURED_SKILLS: FeaturedSkill[] = [
    {
        name: "Java",
        Icon: AnimatedJava,
        color: "#EA2D2E",
        desc: "Robust backend services with Spring Boot, thoughtful API design, asynchronous processing and comprehensive automated testing..",
    },
    {
        name: "React",
        Icon: AnimatedReact,
        color: "#61DAFB",
        desc: "Responsive, accessible user interfaces built with reusable components and modern frontend practices.",
    },
    {
        name: "AWS",
        Icon: AnimatedAws,
        color: "#FF9900",
        desc: "Cloud-native application infrastructure, serverless workloads and automated infrastructure provisioning.",
    },
];

export const SKILL_ROWS: SkillItem[][] = [
    // Languages & frameworks
    [
        { name: "Python",         Icon: SiPython,          color: "#3776AB" },
        { name: "C#",             Icon: TbBrandCSharp,     color: "#512BD4" },
        { name: "Java",           Icon: FaJava,            color: "#EA2D2E" },
        { name: "Spring",         Icon: SiSpring,          color: "#6DB33F" },
        { name: "JUnit",          Icon: SiJunit5,          color: "#25A162" },
        { name: "TypeScript",     Icon: SiTypescript,      color: "#3178C6" },
        { name: "React",          Icon: SiReact,           color: "#61DAFB" },
        { name: "Redux",          Icon: SiRedux,           color: "#764ABC" },
        { name: "Tailwind",       Icon: SiTailwindcss,     color: "#06B6D4" },
    ],
    // Data, delivery & metrics
    [
        { name: "MySQL",          Icon: SiMysql,           color: "#4479A1" },
        { name: "Redis",          Icon: SiRedis,           color: "#FF4438" },
        { name: "RDS",            Icon: AwsRds,            color: "#C925D1" },
        { name: "DynamoDB",       Icon: AwsDynamoDb,       color: "#C925D1" },
        { name: "S3",             Icon: AwsS3,             color: "#7AA116" },
        { name: "Docker",         Icon: SiDocker,          color: "#2496ED" },
        { name: "GitHub Actions", Icon: SiGithubactions,   color: "#2088FF" },
        { name: "Prometheus",     Icon: SiPrometheus,      color: "#E6522C" },
    ],
    // AWS services — colours follow the official AWS Architecture Icon categories
    [
        { name: "Lambda",         Icon: AwsLambda,         color: "#ED7100" },
        { name: "API Gateway",    Icon: AwsApiGateway,     color: "#E7157B" },
        { name: "SQS",            Icon: AwsSqs,            color: "#E7157B" },
        { name: "EC2",            Icon: AwsEc2,            color: "#ED7100" },
        { name: "CloudWatch",     Icon: AwsCloudWatch,     color: "#E7157B" },
        { name: "CloudFormation", Icon: AwsCloudFormation, color: "#E7157B" },
        { name: "Route 53",       Icon: AwsRoute53,        color: "#8C4FFF" },
        { name: "EKS",            Icon: AwsEks,            color: "#ED7100" },
    ],
];
