// Shared deterministic fallback generator for Pythagoras Numerology
// Generates expert-level, detailed, personalized readings when Gemini API is under heavy load, network is offline, or fetch throws

export interface ProfileArrow {
  id?: string;
  name?: string;
  meaning?: string;
  positive?: boolean;
}

export interface ProfileInput {
  fullName: string;
  birthDate: string;
  birthTime?: string;
  lifePath: number;
  lifePathDisplay?: string;
  destiny: number;
  soulUrge: number;
  personality: number;
  attitude?: number;
  birthdayNumber?: number;
  maturity?: number;
  currentYear?: number;
  personalYear: number;
  activeArrows?: (string | ProfileArrow)[];
  emptyArrows?: (string | ProfileArrow)[];
}

const LIFE_PATH_PROFILES: Record<number, {
  name: string;
  coreNature: string;
  talents: string[];
  karmicLessons: string[];
  careerPath: string;
  loveStyle: string;
  universeAdvice: string;
}> = {
  1: {
    name: 'Người Tiên Phong Độc Lập',
    coreNature: 'Bạn mang trường năng lượng của người dẫn đầu, ý chí sắt đá, lòng quả cảm và khát vọng tự khẳng định bản thân.',
    talents: [
      'Khả năng khởi xướng và dẫn dắt tập thể vượt qua khó khăn',
      'Tư duy quyết đoán, độc lập, không sợ đối mặt với thử thách đơn độc',
      'Óc sáng tạo và khả năng biến ý tưởng mới thành hành động thực tế'
    ],
    karmicLessons: [
      'Cần kiềm chế tính độc đoán, bảo thủ và sự thiếu kiên nhẫn với người khác',
      'Học cách lắng nghe lời khuyên và đón nhận sự hỗ trợ từ cộng sự',
      'Tránh biến tự tin thành tự cao, giữ tâm thế khiêm nhường'
    ],
    careerPath: 'Rất phù hợp với vai trò Lãnh đạo, CEO khởi nghiệp, Quản lý điều hành, Chuyên gia độc lập hoặc Nhà phát minh.',
    loveStyle: 'Chủ động, mãnh liệt và bảo bọc người thương, nhưng cần học cách nhường nhịn và tránh áp đặt cái tôi lên mối quan hệ.',
    universeAdvice: 'Hãy dẫn đầu bằng lòng vị tha và tình yêu thương, ngọn đuốc tiên phong của bạn sẽ soi sáng cho hàng ngàn người.'
  },
  2: {
    name: 'Sứ Giả Hòa Bình & Trực Giác',
    coreNature: 'Bạn đại diện cho sự hòa giải, dịu dàng, trực giác nhạy bén và trái tim thấu cảm sâu sắc với mọi biến chuyển xung quanh.',
    talents: [
      'Trực giác tinh tế, linh cảm mạnh mẽ về con người và thời thế',
      'Khả năng đàm phán, hòa giải xung đột và kết nối mọi người',
      'Sự ân cần, lắng nghe và thấu hiểu không phán xét'
    ],
    karmicLessons: [
      'Tránh tâm lý cả nể, sợ làm phật lòng người khác mà chịu thiệt thòi',
      'Học cách thiết lập ranh giới cá nhân và bảo vệ năng lượng của mình',
      'Rèn luyện sự tự tin và quyết đoán khi đưa ra quyết định trọng đại'
    ],
    careerPath: 'Xuất sắc trong lĩnh vực Ngoại giao, Tư vấn tâm lý, Nhân sự (HR), Trị liệu, Nghệ thuật hoặc Cố vấn chiến lược.',
    loveStyle: 'Sâu sắc, chung thủy, luôn tìm kiếm sự đồng điệu về tâm hồn và mong muốn được che chở, sẻ chia chân thành.',
    universeAdvice: 'Hãy tin vào trực giác mách bảo của bạn và dũng cảm cất lên tiếng nói bảo vệ chân lý của chính mình.'
  },
  3: {
    name: 'Bậc Thầy Biểu Đạt & Sáng Tạo',
    coreNature: 'Bạn mang nguồn năng lượng của niềm vui rực rỡ, óc hài hước duyên dáng và trí tưởng tượng nghệ thuật vô tận.',
    talents: [
      'Tài hùng biện, hoạt ngôn và khả năng truyền cảm hứng bằng lời nói/chữ viết',
      'Tư duy thẩm mỹ độc đáo, khả năng đổi mới và sáng tạo không giới hạn',
      'Năng lượng lạc quan xua tan sự ảm đạm trong mọi môi trường'
    ],
    karmicLessons: [
      'Khắc phục thói quen phân tán năng lượng, làm nhiều việc nhưng dở dang',
      'Kiểm soát cảm xúc thất thường và tránh cường điệu hóa khó khăn',
      'Tập trung vào kỷ luật và chiều sâu thay vì bề nổi nhất thời'
    ],
    careerPath: 'Rực sáng trong Marketing, Truyền thông, Diễn giả, Nhà văn, Báo chí, Thiết kế sáng tạo hoặc Giải trí nghệ thuật.',
    loveStyle: 'Lãng mạn, tràn ngập tiếng cười và luôn mang đến bất ngờ cho người yêu, nhưng cần vun đắp tính kiên định lâu bền.',
    universeAdvice: 'Hãy dùng ngòi bút và tiếng nói để thắp lên hy vọng cho nhân gian; sự sáng tạo chân thành là báu vật trời ban.'
  },
  4: {
    name: 'Kiến Trúc Sư Của Nền Tảng',
    coreNature: 'Bạn là hiện thân của sự kỷ luật, trung thực, trật tự và khả năng hiện thực hóa các kế hoạch thành kết quả vững chắc.',
    talents: [
      'Khả năng tổ chức, quản lý quy trình và xây dựng hệ thống chi tiết',
      'Tinh thần trách nhiệm cao độ, sự bền bỉ và kiên trì phi thường',
      'Tư duy logic, thực tế, luôn làm việc dựa trên dữ liệu và bằng chứng'
    ],
    karmicLessons: [
      'Giảm bớt sự cứng nhắc, bảo thủ và nỗi sợ thay đổi vùng an toàn',
      'Học cách thả lỏng tâm trí, tận hưởng cuộc sống thay vì quá áp lực công việc',
      'Mở lòng đón nhận các góc nhìn phi logic hoặc phương pháp mới'
    ],
    careerPath: 'Đặc biệt thành công trong Quản trị tài chính, Kế toán, Kỹ thuật xây dựng, Pháp lý, Vận hành chuỗi hoặc Nghiên cứu.',
    loveStyle: 'Trầm lặng nhưng vô cùng vững chãi; thể hiện tình yêu bằng hành động chăm lo thực tế và sự cam kết trọn đời.',
    universeAdvice: 'Khi bạn kết hợp sự kỷ luật vững chãi với sự mềm dẻo của tâm thức, không thử thách nào có thể cản bước bạn.'
  },
  5: {
    name: 'Lãng Khách Của Tự Do & Đột Phá',
    coreNature: 'Bạn sở hữu tâm hồn phiêu lưu, khao khát tự do mãnh liệt, thích ứng tuyệt vời và luôn tìm kiếm sự đổi mới.',
    talents: [
      'Khả năng thích nghi nhanh nhạy trong mọi hoàn cảnh và môi trường mới',
      'Tư duy phá cách, khả năng nắm bắt xu hướng thị trường sớm',
      'Sức hút xã hội tự nhiên và sự lôi cuốn trong giao tiếp đa văn hóa'
    ],
    karmicLessons: [
      'Cần rèn luyện tính kiên trì, tránh tình trạng cả thèm chóng chán',
      'Kiểm soát sự bốc đồng và tránh sa đà vào những thú vui nhất thời',
      'Xác định rõ mục tiêu cốt lõi để không bị trôi dạt vô định'
    ],
    careerPath: 'Rất hợp với Du lịch, Ngoại thương, Xuất nhập khẩu, Bán hàng cao cấp, Tổ chức sự kiện hoặc Nhà báo tác nghiệp.',
    loveStyle: 'Phóng khoáng, say đắm và ghét sự kiểm soát ngột ngạt; cần một người bạn đời biết tôn trọng không gian riêng tư.',
    universeAdvice: 'Tự do đích thực bắt đầu từ sự tự chủ nội tâm; hãy dùng sự linh hoạt của bạn để khai phóng những giới hạn cũ.'
  },
  6: {
    name: 'Người Nuôi Dưỡng & Tình Yêu Vô Điều Kiện',
    coreNature: 'Bạn mang trái tim từ mẫu bao la, luôn khao khát chở che, bảo bọc gia đình và kiến tạo bình an cho mái ấm.',
    talents: [
      'Năng lực chữa lành cảm xúc, chăm sóc và thấu cảm sâu sắc với người khác',
      'Gu thẩm mỹ tinh tế, tạo dựng không gian sống và làm việc ấm áp',
      'Tinh thần cống hiến và trách nhiệm cao với cộng đồng'
    ],
    karmicLessons: [
      'Tránh xu hướng bao bọc quá mức dẫn đến kiểm soát người thân',
      'Học cách yêu thương chính mình trước khi hy sinh kiệt sức vì người khác',
      'Chấp nhận sự không hoàn hảo và để người khác tự chịu trách nhiệm cho cuộc đời họ'
    ],
    careerPath: 'Lý tưởng trong Y tế, Giáo dục, Tâm lý học, Thiết kế nội thất, Dịch vụ chăm sóc cộng đồng hoặc Nghệ thuật.',
    loveStyle: 'Chăm sóc chu đáo, tận tụy và đặt gia đình lên hàng đầu; luôn vun vén cho một tổ ấm an yên, hòa thuận.',
    universeAdvice: 'Hãy nhớ rằng chén trà của bạn phải đầy trước khi rót cho người khác; yêu thương bản thân là khởi nguồn của lòng từ bi.'
  },
  7: {
    name: 'Nhà Hiền Triết & Người Đi Tìm Chân Lý',
    coreNature: 'Bạn mang năng lượng của người chiêm nghiệm, trí tuệ uyên bác, trực giác tâm linh sâu sắc và khát khao thấu hiểu chân lý.',
    talents: [
      'Khả năng phân tích sâu sắc, nhìn thấu bản chất vấn đề sau bề nổi',
      'Trực giác nhạy bén kết hợp với năng lực tự học và nghiên cứu độc lập',
      'Năng lượng tĩnh lặng giúp mang lại sự khai sáng cho người khác'
    ],
    karmicLessons: [
      'Tránh cô lập bản thân quá mức trong ốc đảo tư tưởng của mình',
      'Học cách cởi mở chia sẻ cảm xúc và tin tưởng vào người xung quanh',
      'Cân bằng giữa lý thuyết triết học với việc thực hành đời sống thực tế'
    ],
    careerPath: 'Thành công vượt bậc trong Nghiên cứu khoa học, Triết học, Phân tích dữ liệu, IT/Lập trình, Tâm lý học hoặc Giáo sư.',
    loveStyle: 'Kín đáo, chọn lọc kỹ càng; cần sự thấu hiểu về mặt tư tưởng và sự tôn trọng tuyệt đối cho những khoảnh khắc tĩnh lặng.',
    universeAdvice: 'Trí tuệ của bạn là ngọn hải đăng soi đường; hãy bước ra ánh sáng và sẻ chia sự thông thái đó cho cuộc đời.'
  },
  8: {
    name: 'Nhà Điều Hành & Bậc Thầy Kiến Tạo Vật Chất',
    coreNature: 'Bạn đại diện cho quyền năng lãnh đạo, tư duy tài chính sắc sảo, sự tự chủ và khả năng làm chủ các nguồn lực vật chất.',
    talents: [
      'Tầm nhìn chiến lược, khả năng quản trị tài chính và tổ chức quy mô lớn',
      'Ý chí kiên cường, phong thái đĩnh đạc và sức bật mạnh mẽ sau nghịch cảnh',
      'Khả năng hiện thực hóa các mục tiêu tài chính và quyền lực'
    ],
    karmicLessons: [
      'Cần cân bằng giữa đời sống vật chất và giá trị tinh thần/tâm linh',
      'Tránh để lòng tham hoặc sự thực dụng chi phối các mối quan hệ',
      'Sử dụng quyền lực để nâng đỡ người khác thay vì kiểm soát họ'
    ],
    careerPath: 'Đỉnh cao trong Đầu tư tài chính, Ngân hàng, Bất động sản, Quản trị doanh nghiệp, Luật thương mại hoặc Doanh nhân.',
    loveStyle: 'Vững chắc, thực tế, luôn muốn bảo đảm sự đủ đầy về kinh tế cho đối phương nhưng cần bày tỏ cảm xúc mềm mại hơn.',
    universeAdvice: 'Sự thịnh vượng bền vững nhất sinh ra từ việc tạo ra giá trị cho xã hội; hãy để tâm tài chính đi đôi với tâm từ bi.'
  },
  9: {
    name: 'Người Nhân Đạo & Linh Hồn Vĩ Đại',
    coreNature: 'Bạn mang trường năng lượng của lòng bác ái, hoài bão lớn lao, tinh thần phụng sự nhân loại và tâm hồn vị tha cao thượng.',
    talents: [
      'Tầm nhìn vĩ mô, lý tưởng sống cao đẹp và sức thu hút quần chúng',
      'Lòng trắc ẩn bao la, sẵn sàng sẻ chia và cống hiến cho xã hội',
      'Năng khiếu nghệ thuật, nhân văn và khả năng chữa lành cộng đồng'
    ],
    karmicLessons: [
      'Tránh sống quá mơ mộng, lý tưởng hóa thực tế dẫn đến thất vọng',
      'Học cách buông bỏ quá khứ và tha thứ cho những tổn thương cũ',
      'Cần chú trọng đến các chi tiết thực tế thay vì chỉ nhìn vào bức tranh lớn'
    ],
    careerPath: 'Rực rỡ trong Tổ chức phi lợi nhuận (NGO), Giáo dục, Hoạt động xã hội, Nghệ thuật, Y học nhân đạo hoặc Luật sư bảo vệ quyền lợi.',
    loveStyle: 'Bao dung, hy sinh và giàu lòng trắc ẩn; luôn mong muốn tìm kiếm một người đồng hành chung chí hướng phụng sự.',
    universeAdvice: 'Khi bạn trao đi tình yêu thương không toan tính, toàn bộ vũ trụ sẽ hội tụ để bảo bọc và nâng bước chân bạn.'
  },
  11: {
    name: 'Bậc Thầy Khai Sáng & Trực Giác Tâm Linh',
    coreNature: 'Số Master 11/2 mang rung động trực giác siêu nhạy, khả năng kết nối tâm linh sâu sắc và sứ mệnh truyền cảm hứng thức tỉnh.',
    talents: [
      'Trực giác tâm linh nhạy bén như ăng-ten bắt sóng vũ trụ',
      'Khả năng truyền cảm hứng, thức tỉnh tiềm năng tiềm ẩn trong người khác',
      'Tầm nhìn nhân văn sâu sắc kết hợp năng lượng sáng tạo tinh hoa'
    ],
    karmicLessons: [
      'Kiểm soát sự nhạy cảm quá mức và tránh bị quá tải bởi năng lượng xung quanh',
      'Cân bằng giữa thế giới tâm linh màu nhiệm và cuộc sống thực tế hàng ngày',
      'Vượt qua nỗi nghi ngờ bản thân để tự tin bước lên vũ đài lãnh đạo tinh thần'
    ],
    careerPath: 'Nhà khai vấn cuộc sống (Life Coach), Chuyên gia tâm lý, Nhà giáo dục tâm linh, Nhà văn truyền cảm hứng hoặc Nhà trị liệu.',
    loveStyle: 'Sâu sắc tuyệt đối, đòi hỏi sự hòa hợp về mặt tâm linh và linh hồn; trung thành và gắn kết bằng năng lượng thanh sạch.',
    universeAdvice: 'Bạn là kênh dẫn của ánh sáng thiêng liêng; hãy giữ cho tâm hồn luôn thanh tịnh để soi đường cho nhân gian.'
  },
  22: {
    name: 'Kiến Trúc Sư Bậc Thầy Vĩ Đại',
    coreNature: 'Số Master 22/4 là con số quyền năng nhất, kết hợp tầm nhìn vĩ đại của số 11 với năng lực thực thi kỷ luật của số 4.',
    talents: [
      'Khả năng biến những dự án không tưởng quy mô thế giới thành hiện thực',
      'Tư duy tổ chức siêu đẳng và tầm nhìn chiến lược xuyên thời đại',
      'Sức chịu đựng, kiên trì và năng lượng hành động phi thường'
    ],
    karmicLessons: [
      'Gánh nặng trách nhiệm quá lớn dễ gây stress và kiệt sức nghiêm trọng',
      'Tránh sự độc đoán, tự phụ và đòi hỏi người khác phải hoàn hảo như mình',
      'Luôn giữ vững đạo đức và lý tưởng phụng sự nhân loại trong mọi dự án'
    ],
    careerPath: 'Nhà kiến tạo vĩ mô, Lãnh đạo tập đoàn đa quốc gia, Nhà quy hoạch đô thị, Nhà sáng lập các tổ chức quốc tế lớn.',
    loveStyle: 'Tận tâm, che chở và là chỗ dựa vững chãi như núi thái sơn; cần người bạn đời thấu hiểu cho sứ mệnh lớn lao của mình.',
    universeAdvice: 'Quyền năng lớn luôn đi kèm trách nhiệm lớn; hãy dùng bàn tay kiến tạo của bạn để xây dựng thế giới tốt đẹp hơn.'
  },
  33: {
    name: 'Bậc Thầy Chữa Lành Bằng Tình Yêu Vô Điều Kiện',
    coreNature: 'Số Master 33/6 là con số đại diện cho tình yêu vũ trụ thuần khiết, lòng trắc ẩn cứu độ và khả năng chữa lành tối thượng.',
    talents: [
      'Khả năng nâng cao tần số rung động và chữa lành tâm hồn cho cộng đồng',
      'Sức hút nhân từ, lời nói mang năng lượng xoa dịu nỗi đau',
      'Sự thấu cảm vượt qua mọi ranh giới của cái tôi cá nhân'
    ],
    karmicLessons: [
      'Cần học cách buông bỏ gánh nặng của người khác, tránh nhận hết đau khổ vào mình',
      'Giữ gìn sức khỏe thân - tâm - trí và thiết lập ranh giới năng lượng lành mạnh',
      'Tránh thất vọng khi lòng tốt bị lợi dụng hoặc hiểu lầm'
    ],
    careerPath: 'Bậc thầy tâm linh, Bác sĩ/Nhà trị liệu toàn diện, Nhà từ thiện quốc tế, Nhà giáo dục nhân bản, Đại sứ hòa bình.',
    loveStyle: 'Yêu thương thuần khiết, vị tha và nâng niu trọn vẹn; xem tình yêu là sự hòa quyện thiêng liêng của hai linh hồn.',
    universeAdvice: 'Tình yêu thương chân thật của bạn là ngọn lửa sưởi ấm thế giới; hãy luôn bảo bọc ngọn lửa ấy bằng sự thông thái.'
  }
};

const PERSONAL_YEAR_ADVICE: Record<number, { theme: string; dos: string[]; donts: string[] }> = {
  1: {
    theme: 'Năm Khởi Đầu & Thiết Lập Mục Tiêu Mới',
    dos: ['Bắt đầu các dự án, công việc hoặc kế hoạch mới', 'Chủ động nắm bắt cơ hội và tự tin hành động độc lập', 'Đầu tư phát triển bản thân và mở rộng tầm nhìn'],
    donts: ['Trì hoãn hoặc phụ thuộc quá nhiều vào người khác', 'Do dự trước những quyết định mang tính bước ngoặt', 'Sợ hãi rủi ro ban đầu']
  },
  2: {
    theme: 'Năm Của Sự Hòa Hợp, Kiên Nhẫn & Kết Nối',
    dos: ['Xây dựng và củng cố các mối quan hệ đối tác, tình cảm', 'Lắng nghe trực giác và rèn luyện tính kiên nhẫn', 'Học cách hợp tác và làm việc nhóm hiệu quả'],
    donts: ['Hấp tấp, vội vã đưa ra quyết định thay đổi lớn', 'Gây xung đột hoặc phản ứng gay gắt với đồng nghiệp', 'Bỏ qua linh cảm nội tâm']
  },
  3: {
    theme: 'Năm Của Sáng Tạo, Mở Rộng & Tỏa Sáng Năng Lượng',
    dos: ['Tích cực giao lưu, mở rộng mạng lưới quan hệ xã hội', 'Bộc lộ tài năng sáng tạo, nghệ thuật hoặc thuyết trình', 'Học thêm kỹ năng mới và tận hưởng niềm vui sống'],
    donts: ['Phân tán năng lượng vào quá nhiều việc vụn vặt', 'Nói năng thiếu suy nghĩ hoặc buôn chuyện tiêu cực', 'Tiêu xài hoang phí theo cảm xúc']
  },
  4: {
    theme: 'Năm Của Củng Cố Nền Tảng, Kỷ Luật & Quản Lý Sức Khỏe',
    dos: ['Tập trung vào trật tự, quy trình và tính kỷ luật', 'Chăm sóc sức khỏe thể chất và cân bằng tài chính an toàn', 'Hoàn thiện những dự án còn dang dở'],
    donts: ['Mạo hiểm đầu tư tài chính rủi ro cao', 'Lười biếng hoặc bỏ qua các nguyên tắc pháp lý/kế hoạch', 'Làm việc quá sức dẫn đến kiệt quệ']
  },
  5: {
    theme: 'Năm Của Đột Phá, Tự Do & Chuyển Mình Linh Hoạt',
    dos: ['Dám thay đổi, đón nhận các cơ hội du lịch hoặc thử thách mới', 'Linh hoạt thích ứng với các biến động công việc', 'Giải phóng bản thân khỏi những thói quen cũ trì trệ'],
    donts: ['Bốc đồng đưa ra các cam kết thiếu suy xét', 'Sa đà vào lối sống buông thả hoặc mạo hiểm nguy hiểm', 'Ngại ngùng trước những đổi thay cần thiết']
  },
  6: {
    theme: 'Năm Của Gia Đình, Trách Nhiệm & Chữa Lành Tình Cảm',
    dos: ['Dành thời gian vun vén mái ấm gia đình và người thân yêu', 'Trang hoàng nhà cửa, làm đẹp không gian sống', 'Thực hành lòng bao dung và phụng sự cộng đồng'],
    donts: ['Áp đặt ý muốn cá nhân lên các thành viên trong nhà', 'Hy sinh quên mình đến mức suy sụp năng lượng', 'Trốn tránh trách nhiệm gắn kết']
  },
  7: {
    theme: 'Năm Của Tĩnh Lặng, Chiêm Nghiệm & Nâng Tầm Trí Tuệ',
    dos: ['Dành thời gian học tập chuyên sâu, thiền định và tĩnh tâm', 'Đánh giá lại con đường đã qua và tái định hình nội lực', 'Thanh lọc tâm trí và bồi đắp kiến thức chuyên môn'],
    donts: ['Mở rộng kinh doanh ồ ạt hoặc đầu cơ tài chính liều lĩnh', 'Ép bản thân phải hòa nhập vào những chốn ồn ào vô nghĩa', 'Né tránh đối diện với nội tâm']
  },
  8: {
    theme: 'Năm Của Thu Hoạch Tài Chính, Quyền Lực & Khẳng Định Vị Thế',
    dos: ['Tập trung tối đa cho sự nghiệp và gặt hái thành quả tài chính', 'Thể hiện vai trò lãnh đạo và nâng cao năng lực quản trị', 'Thực hiện các giao dịch thương mại lớn một cách minh bạch'],
    donts: ['Lạm dụng quyền lực hoặc thiếu minh bạch về tiền bạc', 'Chủ quan bỏ qua chi tiết quản lý rủi ro', 'Để lòng tham lấn át đạo đức kinh doanh']
  },
  9: {
    theme: 'Năm Của Hoàn Tất Chu Kỳ, Buông Bỏ & Nhân Ái',
    dos: ['Hoàn thành dứt điểm chu kỳ 9 năm cũ, dọn sạch tồn đọng', 'Tha thứ, buông bỏ những mối quan hệ độc hại hoặc thói quen xấu', 'Làm việc thiện, từ thiện và lan tỏa giá trị nhân văn'],
    donts: ['Cố chấp bám víu vào những thứ đã hết duyên', 'Khởi nghiệp dự án mới dài hạn khi chưa sẵn sàng', 'Mang tâm lý oán trách cuộc đời']
  }
};

export function generateDeterministicDeepReading(profile: ProfileInput, focusArea?: string): string {
  const lp = profile.lifePath || 1;
  const lpInfo = LIFE_PATH_PROFILES[lp] || LIFE_PATH_PROFILES[1];
  const py = profile.personalYear || 1;
  const pyInfo = PERSONAL_YEAR_ADVICE[py] || PERSONAL_YEAR_ADVICE[1];
  const currYear = profile.currentYear || new Date().getFullYear();

  const focusNotice = focusArea
    ? `\n*Trọng tâm luận giải yêu cầu: ${focusArea}*\n`
    : '';

  return `### 🌟 BẢN LUẬN GIẢI THẦN SỐ HỌC TOÀN DIỆN PYTHAGORAS
**Họ và tên**: ${profile.fullName.toUpperCase()} | **Ngày sinh**: ${profile.birthDate}${profile.birthTime ? ` • **Giờ sinh**: ${profile.birthTime}` : ''}
${focusNotice}

---

#### 1. Tổng Quan Chân Dung Năng Lượng
- **Số Chủ Đạo (${profile.lifePathDisplay || profile.lifePath})**: *${lpInfo.name}*
${lpInfo.coreNature}
- **Sứ Mệnh (${profile.destiny}) & Linh Hồn (${profile.soulUrge})**: Khát khao sâu kín thôi thúc bạn luôn tìm kiếm sự chân thực và hoàn thiện bản thân. Năng lượng Nhân cách số **${profile.personality}** tạo nên phong thái đĩnh đạc, cuốn hút và đáng tin cậy trong mắt người đối diện.
- **Thế chân vạc năng lượng**: Sự phối hợp giữa Số Chủ Đạo ${profile.lifePath} và Sứ Mệnh ${profile.destiny} tạo nên trục cột vững vàng cho con đường phát triển công danh và bình an nội tại của bạn.

---

#### 2. Tiềm Năng & Thế Mạnh Đỉnh Cao (Top Talents)
1. **${lpInfo.talents[0]}**: Đây là vũ khí mạnh nhất giúp bạn tạo dấu ấn nổi bật và vượt lên dẫn đầu.
2. **${lpInfo.talents[1]}**: Nguồn lực nội tại dồi dào hỗ trợ bạn duy trì sự kiên cường trước mọi biến cố.
3. **${lpInfo.talents[2]}**: Điểm sáng thu hút các cơ hội quý nhân phù trợ và mối quan hệ chất lượng.

---

#### 3. Thử Thách & Điểm Mù (Karmic Lessons & Blind Spots)
- **Bài học cần chuyển hóa**:
${lpInfo.karmicLessons.map((k) => `  • ${k}`).join('\n')}
- **Các mũi tên cá tính**: ${
  profile.activeArrows && profile.activeArrows.length > 0
    ? `Bạn sở hữu ${profile.activeArrows
        .map((a) => (typeof a === 'string' ? a : a.name || a.id))
        .filter(Boolean)
        .join(', ')} mang lại ưu thế lớn.`
    : 'Cần chú trọng bổ sung các con số khuyết trên biểu đồ ngày sinh.'
}

---

#### 4. Định Hướng Sự Nghiệp & Tài Chính
- **Môi trường lý tưởng**: ${lpInfo.careerPath}
- **Chiến lược tài chính**: Hãy xây dựng nhiều nguồn thu nhập dựa trên thế mạnh cốt lõi, duy trì tính minh bạch và tránh các hình thức đầu tư siêu lợi nhuận thiếu căn cứ.

---

#### 5. Đời Sống Tình Cảm & Mối Quan Hệ
- **Phong cách yêu & gắn kết**: ${lpInfo.loveStyle}
- **Chìa khóa hòa hợp**: Lắng nghe chân thành, hạ bớt cái tôi và luôn tôn trọng sự tự do của đối phương.

---

#### 6. Vận Trình Năm Cá Nhân (${currYear} - Năm Số ${py})
- **Chủ đề năm**: **${pyInfo.theme}**
- **Việc NÊN LÀM**:
${pyInfo.dos.map((d) => `  ✓ ${d}`).join('\n')}
- **Điều KHÔNG NÊN**:
${pyInfo.donts.map((d) => `  ✗ ${d}`).join('\n')}

---

#### 7. Thông Điệp Khai Sáng Từ Vũ Trụ
*"${lpInfo.universeAdvice}"*
Hãy vững tin bước tiếp trên hành trình thức tỉnh và làm chủ vận mệnh của chính mình!`;
}

export function generateDeterministicCompatibility(
  personA: ProfileInput,
  personB: ProfileInput,
  relationshipType: string = 'Tình yêu & Hôn nhân'
): string {
  const lpA = personA.lifePath || 1;
  const lpB = personB.lifePath || 1;
  const lpAInfo = LIFE_PATH_PROFILES[lpA] || LIFE_PATH_PROFILES[1];
  const lpBInfo = LIFE_PATH_PROFILES[lpB] || LIFE_PATH_PROFILES[1];

  return `### 💖 BẢN PHÂN TÍCH TƯƠNG HỢP NĂNG LƯỢNG PYTHAGORAS
**Cặp đôi**: ${personA.fullName} (Số ${personA.lifePathDisplay || lpA}) & ${personB.fullName} (Số ${personB.lifePathDisplay || lpB})
**Mối quan hệ**: ${relationshipType}

---

#### 1. Đánh Giá Độ Hòa Hợp Năng Lượng
- **Giao thoa Số Chủ Đạo (${lpA} & ${lpB})**: 
  - ${personA.fullName} mang phong thái *${lpAInfo.name}*.
  - ${personB.fullName} mang đặc trưng của *${lpBInfo.name}*.
  Sự kết hợp này tạo nên cặp bài trùng có khả năng bù trừ những điểm thiếu hụt cho nhau nếu cả hai biết lắng nghe và tôn trọng sự khác biệt.

#### 2. Tương Hợp Cảm Xúc & Linh Hồn (Số ${personA.soulUrge} & Số ${personB.soulUrge})
- Cả hai đều có những mong cầu sâu sắc về sự thấu hiểu và tôn trọng. Khi xảy ra bất đồng, việc chủ động mở lời đối thoại nhẹ nhàng sẽ giúp xua tan mọi khoảng cách.

#### 3. Điểm Mạnh Khi Ở Bên Nhau
1. Khả năng tương trợ, làm điểm tựa tinh thần vững chắc cho nhau khi gặp sóng gió cuộc sống.
2. Cùng chia sẻ mục tiêu vun đắp cho sự thịnh vượng và hạnh phúc lâu dài.
3. Kích hoạt những tiềm năng tiềm ẩn trong đối phương mà người kia chưa từng bộc lộ.

#### 4. Vùng Xung Đột Cần Lưu Ý
- Khác biệt về tốc độ xử lý vấn đề hoặc cách thể hiện cảm xúc (một bên có thể hướng ngoại, quyết liệt hơn bên còn lại).
- Cần tránh việc chỉ trích hoặc áp đặt suy nghĩ cá nhân lên đối phương.

#### 5. Lời Khuyên Gắn Kết Trọn Đời
- **Nguyên tắc vàng**: *"Lắng nghe để hiểu thay vì lắng nghe để phản biện"*. Hãy thường xuyên dành thời gian chất lượng riêng tư cho nhau để hâm nóng ngọn lửa cảm xúc!`;
}

export function generateDeterministicQA(
  profile: ProfileInput | null,
  question: string
): string {
  const qLower = question.toLowerCase();
  const name = profile?.fullName || 'bạn';
  const lp = profile?.lifePath || 1;
  const lpInfo = LIFE_PATH_PROFILES[lp] || LIFE_PATH_PROFILES[1];
  const py = profile?.personalYear || 1;
  const pyInfo = PERSONAL_YEAR_ADVICE[py] || PERSONAL_YEAR_ADVICE[1];

  if (qLower.includes('nghề') || qLower.includes('công việc') || qLower.includes('sự nghiệp') || qLower.includes('khởi nghiệp') || qLower.includes('tiền')) {
    return `Chào **${name}**, theo bản đồ Thần số học với Số Chủ Đạo **${profile?.lifePathDisplay || lp}** (${lpInfo.name}):\n\n- **Định hướng lý tưởng**: ${lpInfo.careerPath}\n- **Năm cá nhân ${py} (${pyInfo.theme})**: ${pyInfo.dos[0]}.\n\n💡 **Lời khuyên hành động**: Hãy tập trung phát huy thế mạnh *${lpInfo.talents[0]}* để tạo bước nhảy vọt trong sự nghiệp!`;
  }

  if (qLower.includes('tình') || qLower.includes('yêu') || qLower.includes('hôn nhân') || qLower.includes('gia đình') || qLower.includes('bạn đời')) {
    return `Chào **${name}**, trong phương diện tình cảm:\n\n- **Phong cách yêu của bạn**: ${lpInfo.loveStyle}\n- **Chỉ số Linh hồn (${profile?.soulUrge || lp})**: Bạn luôn khao khát sự thấu cảm, chân thành và tôn trọng tự do cá nhân.\n\n💡 **Lời khuyên**: Để mối quan hệ thăng hoa, hãy thực hành lắng nghe không phán xét và dành nhiều thời gian chất lượng cho người thương.`;
  }

  if (qLower.includes('năm') || qLower.includes('tháng') || qLower.includes('vận') || qLower.includes('năm nay') || qLower.includes('thời điểm')) {
    return `Chào **${name}**, bạn đang ở **Năm Cá Nhân Số ${py}** mang chủ đề **${pyInfo.theme}**:\n\n✓ **NÊN LÀM**: ${pyInfo.dos.join('; ')}.\n✗ **NÊN TRÁNH**: ${pyInfo.donts.join('; ')}.\n\n💡 Đây là thời điểm rất quan trọng để điều chỉnh nhịp điệu sống phù hợp với tần số vũ trụ!`;
  }

  return `Chào **${name}**, dựa trên hồ sơ Số Chủ Đạo **${profile?.lifePathDisplay || lp}** (${lpInfo.name}) và Năm Cá Nhân **${py}**:\n\n- **Thông điệp chính**: ${lpInfo.coreNature}\n- **Bài học cần rèn luyện**: ${lpInfo.karmicLessons[0]}.\n- **Lời khuyên khai mở vận mệnh**: ${lpInfo.universeAdvice}\n\nBạn có thể hỏi thêm chi tiết về sự nghiệp, tình duyên hoặc cách hóa giải các điểm khuyết trong biểu đồ ngày sinh nhé!`;
}
